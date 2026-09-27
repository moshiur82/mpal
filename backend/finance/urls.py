from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, UserWalletView # UserWalletView যোগ করুন

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
    path('wallet/', UserWalletView.as_view(), name='user-wallet'), # এই লাইনটি যোগ করুন
]