from django.db import models
from members.models import Member
from districts.models import District
from groups.models import Group


class NewMemberRegistration(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)

    district = models.ForeignKey(
        District,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    preferred_group = models.ForeignKey(
        Group,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.status})"


class AdminLog(models.Model):
    ACTION_CHOICES = (
        ("create", "Create"),
        ("update", "Update"),
        ("delete", "Delete"),
    )

    user = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True
    )

    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES
    )

    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.action} {self.model_name}"


class Event(models.Model):
    name = models.CharField(max_length=150)
    group = models.ForeignKey(
        Group,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Attendance(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="attendances"
    )
    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE
    )
    attended = models.BooleanField(default=True)

    class Meta:
        unique_together = ("event", "member")

    def __str__(self):
        return f"{self.member} - {self.event}"

