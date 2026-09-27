import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from finance.models import Transaction

User = get_user_model()

def generate_synthetic_data(num_records=1000):
    """
    Generates synthetic transaction data with logical patterns for ML training.
    """
    users = list(User.objects.all())
    if not users:
        print("Error: No users found. Please create a superuser first.")
        return

    categories = ['Subscription', 'Salary', 'Food', 'Shopping', 'Transfer', 'Entertainment', 'Travel', 'Utility']
    transaction_types = ['INCOME', 'EXPENSE']
    
    print(f"Starting generation of {num_records} records...")

    for i in range(num_records):
        user = random.choice(users)
        t_type = random.choices(transaction_types, weights=[0.2, 0.8])[0] # 80% Expense, 20% Income
        
        # Base amount logic
        if t_type == 'INCOME':
            amount = round(random.uniform(500.0, 5000.0), 2)
            category = random.choice(['Salary', 'Transfer', 'Freelance'])
        else:
            amount = round(random.uniform(5.0, 500.0), 2)
            category = random.choice(categories)

        # Introduce "Fraudulent" patterns (High Risk)
        # 1. Sudden large amount at night (e.g., between 2 AM and 4 AM)
        is_fraud = False
        if random.random() < 0.05:  # 5% chance of being a fraud pattern
            is_fraud = True
            amount = amount * random.uniform(10, 50) # Huge amount
            # Random time between 2 AM and 4 AM
            hour = random.randint(2, 4)
        else:
            hour = random.randint(8, 22) # Normal daytime hours

        # Random date within the last 90 days
        days_ago = random.randint(0, 90)
        seconds_ago = random.randint(0, 86400)
        created_at = datetime.now() - timedelta(days=days_ago, seconds=seconds_ago, hours=hour)

        # Creating the transaction
        Transaction.objects.create(
            user=user,
            amount=amount,
            description=f"{category} Transaction",
            transaction_type=t_type,
            category=category,
            created_at=created_at
        )

        if (i + 1) % 100 == 0:
            print(f"Generated {i + 1} records...")

    print(f"Successfully generated {num_records} records with patterns!")

# This allows running the script via: python manage.py runcommands (not standard)
# We will use a simple standalone execution for now.
if __name__ == "__main__":
    generate_synthetic_data(1000)