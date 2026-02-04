from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NewMemberRegistrationViewSet,
    EventViewSet,
    AttendanceViewSet
)

# Create a router and register all viewsets
router = DefaultRouter()
router.register(r'new-members', NewMemberRegistrationViewSet, basename='new-member')
router.register(r'events', EventViewSet, basename='event')
router.register(r'attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
]
