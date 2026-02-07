# members/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Member
from .serializers import MemberSerializer

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
