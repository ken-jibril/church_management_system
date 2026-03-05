# members/urls.py
from rest_framework.routers import DefaultRouter
from .views import MemberRegistrationViewSet, MemberViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'register', MemberRegistrationViewSet, basename='register')
router.register(r'members', MemberViewSet, basename='members')

urlpatterns = [
    path("", include(router.urls)),
]
