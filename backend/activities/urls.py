from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewMemberRegistrationViewSet

# Create a router and register our viewset
router = DefaultRouter()
router.register(r'new-members', NewMemberRegistrationViewSet, basename='new-member')

urlpatterns = [
    path('', include(router.urls)),
]
