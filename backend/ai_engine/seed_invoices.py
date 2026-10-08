import os
import django
import random
from datetime import datetime, timedelta
from decimal import Decimal

# Django এনভায়রনমেন্ট সেটআপ করা
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from finance.models import Transaction, Wallet, Invoice

def run_seeding():
    print("🚀 Starting Data Seeding Process...")

    # ১. ইউজার খুঁজে বের করা
    User = get_user_model()
    try:
        user = User.objects.get(email="admin@mpal.com")
        print(f"✅ Found user: {user.email}")
    except User.DoesNotExist:
        print("❌ Error: Superuser 'admin@mpal.com' not found! Please create it first.")
        return

    # ২. ইউজার এর ওয়ালেট নিশ্চিত করা
    wallet, created = Wallet.objects.get_or_create(user=user, defaults={'balance': 10000.00})
    if created:
        print(f"✅ Created new wallet for {user.email}")
    else:
        print(f"ℹ️ Using existing wallet for {user.email}")

    # ৩. পুরানো ডাটা মুছে ফেলা (Fresh start)
    Transaction.objects.all().delete()
    Invoice.objects.all().delete()
    print("🧹 Old transactions and invoices cleared.")

    # ৪. ডামি ডাটা জেনারেট করা
    clients = ['client_one@gmail.com', 'client_two@yahoo.com', 'client_three@outlook.com', 'client_four@company.com']
    services = ['UI/UX Design', 'Web Development', 'API Integration', 'Marketing Service', 'Consulting']
    statuses = ['PENDING', 'PAID', 'CANCELLED']

    print("Generating data...")

    # ইনভয়েস তৈরি করা
    for i in range(15):
        Invoice.objects.create(
            merchant=user,
            client_email=random.choice(clients),
            amount=round(random.uniform(100, 2000), 2),
            description=random.choice(services),
            status=random.choice(statuses),
            created_at=datetime.now() - timedelta(days=random.randint(0, 30))
        )

    # ট্রানজ্যাকশন তৈরি করা
    for i in range(30):
        t_type = random.choice(['DEPOSIT', 'WITHDRAW', 'TRANSFER'])
        amount = round(random.uniform(10, 500), 2)
        
        if t_type == 'DEPOSIT':
            wallet.balance += Decimal(str(amount))
            Transaction.objects.create(
                receiver=wallet,
                amount=amount,
                transaction_type='DEPOSIT',
                description="Direct Deposit",
                created_at=datetime.now() - timedelta(days=random.randint(0, 30))
            )
        elif t_type == 'WITHDRAW':
            if wallet.balance >= amount:
                wallet.balance -= Decimal(str(amount))
                Transaction.objects.create(
                    sender=wallet,
                    amount=amount,
                    transaction_type='WITHDRAW',
                    description="Cash Withdrawal",
                    created_at=datetime.now() - timedelta(days=random.randint(0, 30))
                )
        else: # TRANSFER
            # এখানে আমরা সিমুলেশন করছি যে অন্য একজন ইউজার আছে (ID: 2)
            try:
                other_wallet = Wallet.objects.exclude(user=user).first()
                if other_wallet and wallet.balance >= amount:
                    wallet.balance -= Decimal(str(amount))
                    other_wallet.balance += Decimal(str(amount))
                    wallet.save()
                    other_wallet.save()
                    Transaction.objects.create(
                        sender=wallet,
                        receiver=other_wallet,
                        amount=amount,
                        transaction_type='TRANSFER',
                        description="Peer-to-peer transfer",
                        created_at=datetime.now() - timedelta(days=random.randint(0, 30))
                    )
            except Exception:
                pass

    wallet.save()
    print(f"✅ Successfully seeded 15 Invoices and 30 Transactions!")
    print(f"💰 Current Wallet Balance: ${wallet.balance}")

if __name__ == "__main__":
    run_seeding()