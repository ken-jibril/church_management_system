# members/urls.py
from rest_framework.routers import DefaultRouter
from .views import MemberRegistrationViewSet, MemberViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'', MemberViewSet, basename='members')  # This will be at /api/members/

# Separate router for registration
register_router = DefaultRouter()
register_router.register(r'register', MemberRegistrationViewSet, basename='register')

# Add custom action URLs directly to ensure they're accessible
member_view = MemberViewSet.as_view({
    'get': 'list',
    'post': 'promote_to_superadmin'
})

role_view = MemberViewSet.as_view({
    'post': 'set_role'
})

urlpatterns = [
    path("", include(router.urls)),
    path("promote_to_superadmin/", member_view, name='promote-superadmin'),
    path("set_role/", role_view, name='set-role'),
    path("", include(register_router.urls)),
]
