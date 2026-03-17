# donations/urls.py
from rest_framework.routers import DefaultRouter
from .views import DonationViewSet, GivingViewSet

router = DefaultRouter()
router.register(r'donations', DonationViewSet, basename='donations')
router.register(r'giving', GivingViewSet, basename='giving')

urlpatterns = router.urls
