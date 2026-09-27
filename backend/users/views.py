from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

class UserProfileView(APIView):
    # শুধুমাত্র লগইন করা ইউজাররাই এই API অ্যাক্সেস করতে পারবে
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # লগইন করা ইউজারের তথ্য Serializer দিয়ে JSON এ রূপান্তর করা হচ্ছে
        serializer = UserSerializer(request.user)
        return Response(serializer.data)