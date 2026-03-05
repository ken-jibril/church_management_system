# members/serializers.py
from rest_framework import serializers
from .models import Member

class MemberSerializer(serializers.ModelSerializer):
    # Override password field to write-only
    password = serializers.CharField(write_only=True, required=False)
    
    # Add a computed role field for easier frontend integration
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = Member
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 
                  'phone_number', 'is_super_admin', 'is_parish_minister', 'is_kirk_session',
                  'can_approve_pending', 'district', 'created_at', 'role']
        
    def get_role(self, obj):
        """Determine user role based on flags"""
        if obj.is_super_admin or obj.is_superuser:
            return 'superadmin'
        if obj.is_parish_minister:
            return 'pastor'
        if obj.is_kirk_session:
            return 'elder'
        return 'member'
        
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
