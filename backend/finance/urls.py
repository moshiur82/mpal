from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TransactionViewSet,
    UserWalletView,
    UserWalletDetailView,
    PaymentLinkViewSet,
    InvoiceViewSet,
    SubscriptionViewSet,
)

router = DefaultRouter()
router.register(r"transactions", TransactionViewSet, basename="transaction")
router.register(r"payment-links", PaymentLinkViewSet, basename="payment-link")
router.register(r"invoices", InvoiceViewSet, basename="invoice")
router.register(r"subscriptions", SubscriptionViewSet, basename="subscription")

urlpatterns = [
    path("", include(router.urls)),
    path("wallet/", UserWalletView.as_view(), name="user-wallet"),
    path("user/<str:email>/", UserWalletDetailView.as_view(), name="user-wallet-detail"),
]