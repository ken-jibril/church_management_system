# members/urls.py
from rest_framework.routers import DefaultRouter
from .views import MemberRegistrationViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'members', MemberRegistrationViewSet, basename='members')

urlpatterns = [
    path("", include(router.urls)),
]
