from django.db import models
from members.models import Member

class District(models.Model):
    """
    Represents a church district.
    Tracks the elder, secretary, treasurer, and deacons for each district.
    """
    name = models.CharField(max_length=100, unique=True)

    elder = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        related_name='elder_district'
    )
    secretary = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        related_name='district_secretary'
    )
    treasurer = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        related_name='district_treasurer'
    )

    deacons = models.ManyToManyField(
        Member,
        related_name='district_deacons',
        blank=True
    )

    def __str__(self):
        return self.name

