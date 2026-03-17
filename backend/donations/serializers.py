from rest_framework import serializers
from .models import Donation, Giving


class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.get_full_name', read_only=True, allow_null=True)
    
    class Meta:
        model = Donation
        fields = [
            'id', 'donor', 'donor_name', 'amount', 'donation_type', 
            'method', 'date', 'reference', 'status', 'notes', 'created_at'
        ]
        read_only_fields = ['created_at']


class GivingSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.get_full_name', read_only=True, allow_null=True)
    
    class Meta:
        model = Giving
        fields = [
            'id', 'member', 'member_name', 'category', 'amount', 
            'date', 'period', 'receipt', 'created_at'
        ]
        read_only_fields = ['created_at']
