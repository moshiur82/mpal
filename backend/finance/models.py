from django.db import models
from django.conf import settings
import uuid


# ─────────────────────────────────────────────
# Choices গুলো file level-এ define করুন (best practice)
# ─────────────────────────────────────────────
TRANSACTION_TYPES = (
    ('DEPOSIT', 'Deposit'),
    ('WITHDRAW', 'Withdraw'),
    ('TRANSFER', 'Transfer'),
)


class Wallet(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wallet'
    )
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s Wallet - ${self.balance}"


class Transaction(models.Model):
    sender = models.ForeignKey(
        Wallet,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='sent_transactions'
    )
    receiver = models.ForeignKey(
        Wallet,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='received_transactions'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_fraud = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.transaction_type}: {self.amount} ({self.description})"


class PaymentLink(models.Model):
    merchant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payment_links'
    )
    product_name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    description = models.TextField(blank=True)
    unique_code = models.CharField(max_length=12, unique=True, editable=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.unique_code:
            self.unique_code = str(uuid.uuid4()).split('-')[0].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_name} - {self.amount}"
    

class Invoice(models.Model):
    INVOICE_STATUS = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
    )

    invoice_number = models.CharField(max_length=20, unique=True, editable=False)
    merchant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices')
    client_email = models.EmailField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=INVOICE_STATUS, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # একটি ইউনিক ইনভয়েস নম্বর তৈরি করা (যেমন: INV-A1B2C3)
            self.invoice_number = f"INV-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.client_email}"