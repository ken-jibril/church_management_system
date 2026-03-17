from rest_framework import serializers
from .models import Group, GroupLeadership


class GroupLeadershipSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.get_full_name', read_only=True)
    
    class Meta:
        model = GroupLeadership
        fields = ['id', 'member', 'member_name', 'role']


class GroupSerializer(serializers.ModelSerializer):
    patron_name = serializers.CharField(source='patron.get_full_name', read_only=True, allow_null=True)
    leadership = GroupLeadershipSerializer(many=True, read_only=True)
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'patron', 'patron_name', 'leadership', 'created_at']
        read_only_fields = ['created_at']
