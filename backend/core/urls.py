from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # ১. ইউজার এবং ফিন্যান্স অ্যাপের URL গুলো
    path('api/', include('users.urls')),
    path('api/', include('finance.urls')),
    
    # ২. JWT Authentication এর জন্য স্পেশাল পাথসমূহ
    # নিশ্চিত করুন এই পাথগুলো 'api/' এর ভেতরে না, বরং 'api/token/' হিসেবে আছে
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]