from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.db import transaction

from .serializers import RegisterSerializer, UserSerializer
from finance.models import Wallet


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                user = serializer.save()
                Wallet.objects.get_or_create(user=user, defaults={"balance": 0.00})
            return Response(
                {
                    "message": "User created successfully!",
                    "user": {
                        "username": getattr(user, "username", ""),
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_email(request):
    user = request.user
    user.is_verified = True
    user.save(update_fields=["is_verified"])
    return Response(
        {"message": "Email verified successfully!"},
        status=status.HTTP_200_OK,
    )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = UserSerializer(request.user).data
        data["is_verified"] = getattr(request.user, "is_verified", False)
        return Response(data)