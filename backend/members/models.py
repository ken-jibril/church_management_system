from django.db import models
from django.contrib.auth.models import AbstractUser

class Member(AbstractUser):
    """
    Custom User model for PCEA Covenant Church members.
    Extends Django's AbstractUser to include:
      - Phone number
      - High-level roles
      - Timestamps
    """
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    can_approve_pending = models.BooleanField(default=False)

    # Use string reference to avoid circular import
    district = models.ForeignKey(
        'districts.District',  # <-- string reference instead of importing District
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # High-level roles
    is_super_admin = models.BooleanField(default=False)      # You / brain
    is_parish_minister = models.BooleanField(default=False)  # Parish Minister
    is_kirk_session = models.BooleanField(default=False)     # Kirk Session elders

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"  # Shows full name in admin
