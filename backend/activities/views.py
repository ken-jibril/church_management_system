from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import serializers, mixins


from members.models import Member
from .models import NewMemberRegistration, AdminLog, Event, Attendance
from .serializers import (
    NewMemberRegistrationSerializer,
    MemberSerializer,
    EventSerializer,
    AttendanceSerializer
)


# -------------------------
# New Member Registration
# -------------------------
class NewMemberRegistrationViewSet(viewsets.ModelViewSet):
    queryset = NewMemberRegistration.objects.all()
    serializer_class = NewMemberRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        # Admins see all registrations
        if user.is_super_admin or user.can_approve_pending:
            return qs
        # Regular members see only approved registrations
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


# -------------------------
# Event
# -------------------------
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        # Admins and members see all events
        return qs


# -------------------------
# Attendance
# -------------------------
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        # Admins and approvers see all attendance
        if user.is_super_admin or user.can_approve_pending:
            return qs
        # Regular members: only their own attendance records
        return qs.filter(member=user)

# -------------------------
# Public Member Registration (Instant Account)
# -------------------------

class MemberRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Member
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "district",
            "password",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        member = Member.objects.create_user(**validated_data)
        member.set_password(password)
        member.save()
        return member


class MemberRegistrationViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):

    serializer_class = MemberRegistrationSerializer
    permission_classes = [permissions.AllowAny]  # anyone can register

    def create(self, request):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()

        return Response(
            {
                "message": "Account created successfully!",
                "member": MemberSerializer(member).data,
            },
            status=status.HTTP_201_CREATED,
        )
