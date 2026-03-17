from rest_framework import viewsets
from .models import Donation, Giving
from .serializers import DonationSerializer, GivingSerializer


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow filtering by status, donation_type
        status = self.request.query_params.get('status')
        donation_type = self.request.query_params.get('donation_type')
        
        if status:
            queryset = queryset.filter(status=status)
        if donation_type:
            queryset = queryset.filter(donation_type=donation_type)
            
        return queryset.order_by('-created_at')


class GivingViewSet(viewsets.ModelViewSet):
    queryset = Giving.objects.all()
    serializer_class = GivingSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow filtering by category
        category = self.request.query_params.get('category')
        
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset.order_by('-created_at')
