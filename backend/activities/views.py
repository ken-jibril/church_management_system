from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from members.models import Member
from .models import NewMemberRegistration
from .serializers import NewMemberRegistrationSerializer, MemberSerializer
from .models import AdminLog


class NewMemberRegistrationViewSet(viewsets.ModelViewSet):
    queryset = NewMemberRegistration.objects.all()
    serializer_class = NewMemberRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        # Admins see all
        if user.is_super_admin or user.can_approve_pending:
            return qs
        # Regular members see only approved
        return qs.filter(status="approved")

    # -------------------------
    # Custom action: approve
    # -------------------------
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        registration = self.get_object()
        user = request.user

        try:
            member = registration.approve(user)
        except PermissionError as e:
            return Response({'detail': str(e)}, status=status.HTTP_403_FORBIDDEN)

        serializer = MemberSerializer(member)
        return Response({
            'message': f'{registration.first_name} {registration.last_name} approved!',
            'member': serializer.data
        })

    # -------------------------
    # Custom action: reject
    # -------------------------
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        registration = self.get_object()
        user = request.user

        try:
            registration.reject(user)
        except PermissionError as e:
            return Response({'detail': str(e)}, status=status.HTTP_403_FORBIDDEN)

        return Response({
            'message': f'{registration.first_name} {registration.last_name} rejected!'
        })
