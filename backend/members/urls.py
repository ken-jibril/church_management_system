# members/urls.py
from rest_framework.routers import DefaultRouter
from .views import MemberRegistrationViewSet, MemberViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'members', MemberRegistrationViewSet, basename='members')
router.register(r'all', MemberViewSet, basename='all-members')

urlpatterns = [
    path("", include(router.urls)),
]
