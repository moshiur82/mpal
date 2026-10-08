from django.urls import path
from .views import register_user, verify_email, UserProfileView

urlpatterns = [
    path("register/", register_user, name="register"),
    path("verify/", verify_email, name="verify_email"),
    path("me/", UserProfileView.as_view(), name="me"),
]