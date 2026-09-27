from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from finance.models import Transaction
import random
from datetime import datetime, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with dummy transaction data'

    def handle(self, *args, **options):
        # ১. সুপারইউজার খুঁজে বের করা
        try:
            user = User.objects.get(email="admin@mpal.com")
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('Error: Superuser with email admin@mpal.com not found!'))
            return

        # ২. পুরনো ডাটা মুছে ফেলা (যাতে প্রতিবার রান করলে ডাটা ডুপ্লিকেট না হয়)
        Transaction.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Cleaning old data... Done!'))

        # ৩. ডামি ডাটা জেনারেট করা
        categories = ['Subscription', 'Salary', 'Food', 'Shopping', 'Transfer', 'Entertainment', 'Travel']
        types = ['INCOME', 'EXPENSE']
        
        self.stdout.write(self.style.SUCCESS('Generating dummy transactions...'))

        for i in range(50):  # আমরা ৫০টি ট্রানজ্যাকশন তৈরি করবো
            t_type = random.choices(types, weights=[0.3, 0.7])[0] # ৭০% খরচ, ৩০% আয়
            amount = round(random.uniform(10.0, 500.0), 2) if t_type == 'EXPENSE' else round(random.uniform(500.0, 5000.0), 2)
            
            # র‍্যান্ডম তারিখ তৈরি (গত ৬ মাসের মধ্যে)
            days_ago = random.randint(0, 180)
            created_at = datetime.now() - timedelta(days=days_ago)

            Transaction.objects.create(
                user=user,
                amount=amount,
                description=f"{random.choice(categories)} Payment",
                transaction_type=t_type,
                category=random.choice(categories),
                created_at=created_at
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded 50 transactions for {user.email}!'))