# members/serializers.py
from rest_framework import serializers
from .models import Member

class MemberSerializer(serializers.ModelSerializer):
    # Override password field to write-only
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Member
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 
                  'phone_number', 'is_super_admin', 'is_parish_minister', 'is_kirk_session',
                  'can_approve_pending', 'district', 'created_at']
        
    def create(self, validated_data):
        # Remove password from validated data
        password = validated_data.pop('password', None)
        
        # Create user instance
        user = Member(**validated_data)
        
        # Hash password if provided
        if password:
            user.set_password(password)
        
        user.save()
        return user
