# members/views.py
from rest_framework import viewsets, permissions, status, generics
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
        print(f"Registration request data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        print(f"Serializer is valid: {serializer.is_valid()}")
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
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

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def promote_to_superadmin(self, request):
        """Promote current user or another user to superadmin"""
        user = request.user
        
        # Allow users to promote themselves or superadmin to promote others
        target_user_id = request.data.get('user_id')
        
        if target_user_id:
            # Superadmin promoting another user
            if not user.is_super_admin:
                return Response(
                    {"detail": "Only superadmin can promote other users"},
                    status=status.HTTP_403_FORBIDDEN
                )
            try:
                target_user = Member.objects.get(id=target_user_id)
                target_user.is_super_admin = True
                target_user.can_approve_pending = True
                target_user.save()
                return Response({
                    "message": f"User {target_user.username} promoted to superadmin",
                    "user": MemberSerializer(target_user).data
                })
            except Member.DoesNotExist:
                return Response(
                    {"detail": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            # User promoting themselves (for first-time setup)
            user.is_super_admin = True
            user.can_approve_pending = True
            user.save()
            return Response({
                "message": "You have been promoted to superadmin",
                "user": MemberSerializer(user).data
            })

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def set_role(self, request):
        """Set role flags for a user (superadmin only)"""
        if not request.user.is_super_admin:
            return Response(
                {"detail": "Only superadmin can set roles"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_id = request.data.get('user_id')
        role = request.data.get('role')  # 'pastor', 'elder', 'member'
        
        if not user_id or not role:
            return Response(
                {"detail": "user_id and role are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            target_user = Member.objects.get(id=user_id)
            
            # Reset all role flags
            target_user.is_parish_minister = False
            target_user.is_kirk_session = False
            target_user.is_super_admin = False
            
            # Set new role
            if role == 'pastor':
                target_user.is_parish_minister = True
            elif role == 'elder':
                target_user.is_kirk_session = True
            elif role == 'superadmin':
                target_user.is_super_admin = True
                target_user.can_approve_pending = True
            
            target_user.save()
            
            return Response({
                "message": f"User role set to {role}",
                "user": MemberSerializer(target_user).data
            })
            
        except Member.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

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

class RegisterView(generics.CreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer