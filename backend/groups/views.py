from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Group, GroupLeadership
from .serializers import GroupSerializer, GroupLeadershipSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    
    def create(self, request, *args, **kwargs):
        # Extract leadership data from request
        name = request.data.get('name')
        patron_id = request.data.get('patron')
        
        # Create group
        group = Group.objects.create(
            name=name,
            patron_id=patron_id if patron_id else None
        )
        
        # Handle leadership roles
        leadership_fields = [
            'chairperson', 'vice_chairperson', 'secretary', 
            'vice_secretary', 'treasurer', 'vice_treasurer'
        ]
        
        for role_field in leadership_fields:
            member_id = request.data.get(role_field)
            if member_id:
                role_name = role_field.replace('_', ' ').title()
                if role_field == 'vice_treasurer':
                    role_name = 'Vice Treasurer'
                GroupLeadership.objects.create(
                    group=group,
                    member_id=member_id,
                    role=role_name
                )
        
        serializer = self.get_serializer(group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Update basic fields
        instance.name = request.data.get('name', instance.name)
        instance.patron_id = request.data.get('patron', instance.patron_id)
        instance.save()
        
        # Update leadership if provided
        if 'leadership' in request.data:
            # Remove existing leadership
            instance.leadership.all().delete()
            
            # Add new leadership
            for role_field in ['chairperson', 'vice_chairperson', 'secretary', 
                             'vice_secretary', 'treasurer', 'vice_treasurer']:
                member_id = request.data.get(role_field)
                if member_id:
                    role_name = role_field.replace('_', ' ').title()
                    if role_field == 'vice_treasurer':
                        role_name = 'Vice Treasurer'
                    GroupLeadership.objects.create(
                        group=instance,
                        member_id=member_id,
                        role=role_name
                    )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get all members in a group"""
        group = self.get_object()
        # This would need a member-group relationship
        return Response({'message': 'Members endpoint not implemented yet'})
