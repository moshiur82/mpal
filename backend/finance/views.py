from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Transaction, Wallet
from .serializers import TransactionSerializer
from ai_engine.predictor import FraudPredictor
from django.db import transaction
from django.core.exceptions import ValidationError
from decimal import Decimal
import numpy as np
import pandas as pd


class UserWalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            wallet = request.user.wallet
            return Response({
                "balance": float(wallet.balance),
                "updated_at": wallet.updated_at
            }, status=status.HTTP_200_OK)
        except Wallet.DoesNotExist:
            return Response({"error": "Wallet not found"}, status=status.HTTP_404_NOT_FOUND)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def deposit(self, request):
        try:
            amount = Decimal(str(request.data.get('amount')))
            if amount <= 0:
                return Response(
                    {"error": "Amount must be positive"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user_wallet = request.user.wallet

            with transaction.atomic():
                # ১. ব্যালেন্স আপডেট
                user_wallet.balance += amount
                user_wallet.save()

                # ২. ট্রানজ্যাকশন রেকর্ড তৈরি
                Transaction.objects.create(
                    sender=None,  # মডেলে sender null=True থাকতে হবে
                    receiver=user_wallet,
                    amount=amount,
                    transaction_type='DEPOSIT',
                    description="Money deposited via platform"
                )

            return Response({
                "message": "Deposit successful!",
                "new_balance": float(user_wallet.balance)
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"DEPOSIT ERROR: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_queryset(self):
        return Transaction.objects.filter(sender__user=self.request.user) | \
               Transaction.objects.filter(receiver__user=self.request.user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            # ১. রিকোয়েস্ট থেকে ডাটা সংগ্রহ
            receiver_wallet_id = request.data.get('receiver_wallet_id')
            raw_amount = request.data.get('amount')
            description = request.data.get('description', '')
            transaction_type = request.data.get('transaction_type')

            # ২. প্রাথমিক ভ্যালিডেশন
            if not receiver_wallet_id or not raw_amount or not transaction_type:
                return Response(
                    {"error": "receiver_wallet_id, amount, and transaction_type are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # ৩. ডাটা টাইপ কনভার্ট
            amount = Decimal(str(raw_amount))
            sender_wallet = request.user.wallet
            receiver_wallet = Wallet.objects.get(id=receiver_wallet_id)

            if sender_wallet.balance < amount:
                return Response(
                    {"error": "Insufficient funds"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # ৪. AI Prediction
            predictor = FraudPredictor()

            input_dict = {
                'amount': float(amount),
                'hour': 12,
                'day_of_week': 0,
                'amount_log': np.log1p(float(amount))
            }

            for col in predictor.features:
                if f'transaction_type_{transaction_type}' == col:
                    input_dict[col] = 1
                elif col not in input_dict:
                    input_dict[col] = 0

            input_df = pd.DataFrame([input_dict])[predictor.features]
            is_fraud = predictor.model.predict(input_df)[0]

            # ৫. ডাটাবেস আপডেট
            sender_wallet.balance -= amount
            sender_wallet.save()

            receiver_wallet.balance += amount
            receiver_wallet.save()

            if is_fraud:
                description = f"[⚠️ FRAUD DETECTED] {description}"

            # ৬. ট্রানজ্যাকশন রেকর্ড
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            serializer.save(
                sender=sender_wallet,
                receiver=receiver_wallet,
                description=description,
                is_fraud=bool(is_fraud)
            )

            return Response({
                "message": "Transfer successful!",
                "is_fraud": bool(is_fraud),
                "new_balance": float(sender_wallet.balance)
            }, status=status.HTTP_201_CREATED)

        except Wallet.DoesNotExist:
            return Response(
                {"error": "Receiver wallet not found"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            return Response(
                {"error": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"CRITICAL ERROR: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )