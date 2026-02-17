# members/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Member
from .serializers import MemberSerializer
from rest_framework.permissions import IsAuthenticated

class MemberRegistrationViewSet(viewsets.GenericViewSet):
    serializer_class = MemberSerializer
    permission_classes = [permissions.AllowAny]  # anyone can register

    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create user with hashed password
        password = serializer.validated_data.pop("password")
        member = Member.objects.create_user(**serializer.validated_data)
        member.set_password(password)
        member.save()

        return Response({
            "message": "Account created successfully!",
            "member": MemberSerializer(member).data,
        }, status=status.HTTP_201_CREATED)

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Super admin sees everything
        if user.is_super_admin:
            return Member.objects.all()

        # Kirk session sees all
        if user.is_kirk_session:
            return Member.objects.all()

        # Normal members can only see all but not modify
        return Member.objects.all()

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_super_admin:
            return Response(
                {"detail": "Only super admin can delete members."},
                status=403
            )
        return super().destroy(request, *args, **kwargs)