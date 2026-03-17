"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .views import home
from rest_framework_simplejwt.views import ( TokenObtainPairView, TokenRefreshView,)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from members.serializers import MemberSerializer
from members.views import MemberRegistrationViewSet, MemberViewSet

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = MemberSerializer(request.user)
        return Response(serializer.data)

class PromoteToSuperAdminView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        user.is_super_admin = True
        user.can_approve_pending = True
        user.save()
        return Response({
            "message": "You have been promoted to superadmin",
            "user": MemberSerializer(user).data
        })

class SetUserRoleView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if not request.user.is_super_admin:
            return Response(
                {"detail": "Only superadmin can set roles"},
                status=403
            )
        
        user_id = request.data.get('user_id')
        role = request.data.get('role')
        
        if not user_id or not role:
            return Response(
                {"detail": "user_id and role are required"},
                status=400
            )
            
        try:
            from members.models import Member
            target_user = Member.objects.get(id=user_id)
            
            # Reset all roles
            target_user.is_parish_minister = False
            target_user.is_kirk_session = False
            target_user.is_super_admin = False
            
            # Set new role
            if role == 'pastor':
                target_user.is_parish_minister = True
            elif role == 'elder':
                target_user.is_kirk_session = True
            elif role == 'superadmin':
                target_user.is_super_admin = True
                target_user.can_approve_pending = True
            
            target_user.save()
            
            return Response({
                "message": f"User role set to {role}",
                "user": MemberSerializer(target_user).data
            })
            
        except Member.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

urlpatterns = [
    path("", home),
    path('admin/', admin.site.urls),

    #JWT - Use working MemberRegistrationViewSet
    path('auth/register/', MemberRegistrationViewSet.as_view({'post': 'register'}), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='me'),
    
    # Role management endpoints
    path('auth/promote/', PromoteToSuperAdminView.as_view(), name='promote-superadmin'),
    path('auth/set-role/', SetUserRoleView.as_view(), name='set-role'),

    # App-specific endpoints
    path('members/', include('members.urls')),
    path('activities/', include('activities.urls')),
    path('groups/', include('groups.urls')),
    path('donations/', include('donations.urls')),
]
