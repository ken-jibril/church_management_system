from rest_framework import serializers
from members.models import Member
from activities.models import NewMemberRegistration, Event, Attendance
from districts.models import District
from groups.models import Group

# -----------------------
# Member Serializer
# -----------------------
class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'phone_number', 'district', 'is_super_admin',
            'is_parish_minister', 'is_kirk_session',
        ]
        read_only_fields = ['is_super_admin', 'is_parish_minister', 'is_kirk_session']

# -----------------------
# New Member Registration Serializer
# -----------------------
class NewMemberRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewMemberRegistration
        fields = [
            "id",
            "first_name",
            "last_name",
            "phone_number",
            "email",
            "district",
            "preferred_group",
            "status",
            "created_at",
        ]
        read_only_fields = ['status', 'created_at']

# -----------------------
# Event Serializer
# -----------------------
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

# -----------------------
# Attendance Serializer
# -----------------------
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Attendance.objects.all(),
                fields=['event', 'member'],
                message="This member already has an attendance record for this event."
            )
        ]
