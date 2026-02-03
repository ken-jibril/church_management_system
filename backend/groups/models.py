from django.db import models
from members.models import Member

class Group(models.Model):
    """
    Represents a church group.
    Tracks the patron (elder) and group name.
    """
    name = models.CharField(max_length=100, unique=True)
    patron = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        related_name='patron_groups'
    )

    def __str__(self):
        return self.name


class GroupLeadership(models.Model):
    """
    Tracks leadership roles for each group.
    Each role can only be assigned once per group.
    """
    ROLE_CHOICES = [
        ('Chairperson', 'Chairperson'),
        ('Vice Chairperson', 'Vice Chairperson'),
        ('Secretary', 'Secretary'),
        ('Vice Secretary', 'Vice Secretary'),
        ('Treasurer', 'Treasurer'),
        ('Vice Treasurer', 'Vice Treasurer'),  # only for PCMF
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)

    class Meta:
        unique_together = ('group', 'role')  # prevents duplicate roles

    def __str__(self):
        return f"{self.member} - {self.role} ({self.group})"

