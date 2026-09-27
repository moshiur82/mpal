from django.db import models
from django.conf import settings

class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s Wallet - ${self.balance}"

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('DEPOSIT', 'Deposit'),
        ('WITHDRAW', 'Withdraw'),
        ('TRANSFER', 'Transfer'),
    )

    # টাকা কে পাঠালো (যদি থাকে)
    sender = models.ForeignKey(Wallet, on_delete=models.SET_NULL, null=True, related_name='sent_transactions')
    # টাকা কে গ্রহণ করলো (যদি থাকে)
    receiver = models.ForeignKey(Wallet, on_delete=models.SET_NULL, null=True, related_name='received_transactions')
    
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    description = models.CharField(max_length=255)  # <--- এখানে এখন ঠিক করা হয়েছে
    created_at = models.DateTimeField(auto_now_add=True)
    is_fraud = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.transaction_type}: {self.amount} ({self.description})"