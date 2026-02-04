from django.db import models

# Use string references for related models to avoid circular imports


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
        'districts.District',  # string reference
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    preferred_group = models.ForeignKey(
        'groups.Group',  # string reference
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

    def approve(self, approved_by):
        """
        Convert this pending registration to a real Member.
        Only Super Admin or delegated can approve.
        """
        from members.models import Member  # import here to avoid circular import

        if not (approved_by.is_superuser or approved_by.can_approve_pending):
            raise PermissionError("You do not have permission to approve new members.")

        # Create actual Member
        member = Member.objects.create_user(
            username=f"{self.first_name.lower()}.{self.last_name.lower()}",
            first_name=self.first_name,
            last_name=self.last_name,
            email=self.email,
            password="changeme123",
        )

        # Assign district if provided
        if self.district:
            member.district = self.district
            member.save()

        # Mark registration as approved
        self.status = "approved"
        self.save()

        # Admin log (no import needed since AdminLog is in the same file)
        AdminLog.objects.create(
            user=approved_by,
            action="update",
            model_name="NewMemberRegistration",
            object_id=str(self.pk),
            description=f"Approved new member: {self.first_name} {self.last_name}"
        )

        return member

    def reject(self, rejected_by):
        """
        Reject a pending registration.
        Only Super Admin or delegated can reject.
        """
        if not (rejected_by.is_superuser or rejected_by.can_approve_pending):
            raise PermissionError("You do not have permission to reject new members.")

        # Mark registration as rejected
        self.status = "rejected"
        self.save()

        # Admin log
        AdminLog.objects.create(
            user=rejected_by,
            action="update",
            model_name="NewMemberRegistration",
            object_id=str(self.pk),
            description=f"Rejected new member: {self.first_name} {self.last_name}"
        )


class AdminLog(models.Model):
    ACTION_CHOICES = (
        ("create", "Create"),
        ("update", "Update"),
        ("delete", "Delete"),
    )

    user = models.ForeignKey(
        'members.Member',  # string reference
        on_delete=models.SET_NULL,
        null=True
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.action} {self.model_name}"


class Event(models.Model):
    name = models.CharField(max_length=150)
    group = models.ForeignKey(
        'groups.Group',  # string reference
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
        'members.Member',  # string reference
        on_delete=models.CASCADE
    )
    attended = models.BooleanField(default=True)

    class Meta:
        unique_together = ("event", "member")

    def __str__(self):
        return f"{self.member} - {self.event}"
