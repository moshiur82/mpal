from datetime import timedelta
from decimal import Decimal

import numpy as np
import pandas as pd
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ai_engine.predictor import FraudPredictor
from .models import Invoice, PaymentLink, Subscription, Transaction, Wallet
from .serializers import (
    InvoiceSerializer,
    PaymentLinkSerializer,
    SubscriptionSerializer,
    TransactionSerializer,
)

class PaymentLinkViewSet(viewsets.ModelViewSet):
    queryset = PaymentLink.objects.all()
    serializer_class = PaymentLinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(merchant=self.request.user)

    def perform_create(self, serializer):
        serializer.save(merchant=self.request.user)


class UserWalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        return Response(
            {
                "balance": float(wallet.balance),
                "updated_at": wallet.updated_at,
            },
            status=status.HTTP_200_OK,
        )


class UserWalletDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, email):
        try:
            user = get_object_or_404(get_user_model(), email=email)
            wallet = user.wallet
            return Response(
                {
                    "email": user.email,
                    "username": getattr(user, "username", ""),
                    "wallet_id": wallet.id,
                    "balance": float(wallet.balance),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(
            sender__user=self.request.user
        ) | Transaction.objects.filter(receiver__user=self.request.user)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def deposit(self, request):
        try:
            amount = Decimal(str(request.data.get("amount")))
            if amount <= 0:
                return Response(
                    {"error": "Amount must be positive"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_wallet, _ = Wallet.objects.get_or_create(user=request.user)

            with transaction.atomic():
                user_wallet.balance += amount
                user_wallet.save()
                Transaction.objects.create(
                    sender=None,
                    receiver=user_wallet,
                    amount=amount,
                    transaction_type="DEPOSIT",
                    description="Money deposited via platform",
                )

            return Response(
                {
                    "message": "Deposit successful!",
                    "new_balance": float(user_wallet.balance),
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            print(f"DEPOSIT ERROR: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            receiver_wallet_id = request.data.get("receiver_wallet_id")
            raw_amount = request.data.get("amount")
            description = request.data.get("description", "")
            transaction_type = request.data.get("transaction_type")

            if not receiver_wallet_id or not raw_amount or not transaction_type:
                return Response(
                    {
                        "error": "receiver_wallet_id, amount, and transaction_type are required."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            amount = Decimal(str(raw_amount))
            sender_wallet, _ = Wallet.objects.get_or_create(user=request.user)
            receiver_wallet = Wallet.objects.get(id=receiver_wallet_id)

            if sender_wallet.balance < amount:
                return Response(
                    {"error": "Insufficient funds"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            predictor = FraudPredictor()
            input_dict = {
                "amount": float(amount),
                "hour": timezone.now().hour,
                "day_of_week": timezone.now().weekday(),
                "amount_log": np.log1p(float(amount)),
            }
            for col in predictor.features:
                if f"transaction_type_{transaction_type}" == col:
                    input_dict[col] = 1
                elif col not in input_dict:
                    input_dict[col] = 0

            input_df = pd.DataFrame([input_dict])[predictor.features]
            is_fraud = bool(predictor.model.predict(input_df)[0])

            sender_wallet.balance -= amount
            sender_wallet.save()
            receiver_wallet.balance += amount
            receiver_wallet.save()

            if is_fraud:
                description = f"[FRAUD DETECTED] {description}"

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(
                sender=sender_wallet,
                receiver=receiver_wallet,
                amount=amount,
                transaction_type=transaction_type,
                description=description,
                is_fraud=is_fraud,
            )

            return Response(
                {
                    "message": "Transfer successful!",
                    "is_fraud": is_fraud,
                    "new_balance": float(sender_wallet.balance),
                },
                status=status.HTTP_201_CREATED,
            )
        except Wallet.DoesNotExist:
            return Response(
                {"error": "Receiver wallet not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValidationError as e:
            return Response(
                {"error": getattr(e, "detail", str(e))},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            print(f"CRITICAL ERROR: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(merchant=self.request.user)

    def perform_create(self, serializer):
        serializer.save(merchant=self.request.user)


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    VALID_PLANS = ["FREE", "PRO", "BUSINESS", "ENTERPRISE"]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        plan = serializer.validated_data.get("plan_type", "FREE")
        if isinstance(plan, str):
            plan = plan.upper()

        if plan not in self.VALID_PLANS:
            plan = "FREE"

        next_billing = timezone.now() + timedelta(days=30)

        serializer.save(
            user=self.request.user,
            plan_type=plan,
            status="ACTIVE",
            next_billing_date=next_billing,
        )