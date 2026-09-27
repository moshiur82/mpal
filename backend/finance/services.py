from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Wallet, Transaction

class PaymentService:
    @staticmethod
    @transaction.atomic
    def transfer_money(sender_wallet_id, receiver_wallet_id, amount, description):
        """
        Executes an atomic money transfer between two wallets.
        """
        # ১. ওয়ালেট দুটিকে লক করে ডাটাবেস থেকে আনা (select_for_update)
        # এটি নিশ্চিত করে যে একই সময়ে অন্য কেউ এই ওয়ালেট পরিবর্তন করতে পারবে না
        try:
            sender_wallet = Wallet.objects.select_for_update().get(id=sender_wallet_id)
            receiver_wallet = Wallet.objects.select_for_update().get(id=receiver_wallet_id)
        except Wallet.DoesNotExist:
            raise ValidationError("One or both wallets do not exist.")

        # ২. ব্যালেন্স চেক করা
        if sender_wallet.balance < amount:
            raise ValidationError("Insufficient funds in sender's wallet.")

        if amount <= 0:
            raise ValidationError("Transfer amount must be greater than zero.")

        # ৩. টাকা পাঠানো (Transaction logic)
        # প্রেরকের ব্যালেন্স কমানো
        sender_wallet.balance -= amount
        sender_wallet.save()

        # প্রাপকের ব্যালেন্স বাড়ানো
        receiver_wallet.balance += amount
        receiver_wallet.save()

        # ৪. ট্রানজ্যাকশন রেকর্ড তৈরি করা
        # প্রেরকের জন্য একটি রেকর্ড (EXPENSE হিসেবে)
        Transaction.objects.create(
            sender=sender_wallet,
            receiver=receiver_wallet,
            amount=amount,
            transaction_type='TRANSFER',
            description=f"Sent to {receiver_wallet.user.email}: {description}"
        )

        # প্রাপকের জন্য একটি রেকর্ড (INCOME হিসেবে)
        Transaction.objects.create(
            sender=sender_wallet,
            receiver=receiver_wallet,
            amount=amount,
            transaction_type='TRANSFER',
            description=f"Received from {sender_wallet.user.email}: {description}"
        )

        return True