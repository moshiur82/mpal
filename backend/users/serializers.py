from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = ["id", "email"]


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Allow login with email + password.
    Frontend should POST: { "email": "...", "password": "..." }
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Replace username field with email
        self.fields[self.username_field] = serializers.EmailField()

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        return token

    def validate(self, attrs):
        # If USERNAME_FIELD is already 'email', super() works with email key
        # Map email -> username field name expected by parent
        email = attrs.get("email") or attrs.get(self.username_field)
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("No account found with this email.")

        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is disabled.")

        # Build tokens manually
        refresh = self.get_token(user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "email": user.email,
            "username": getattr(user, "username", ""),
        }
        self.user = user
        return data