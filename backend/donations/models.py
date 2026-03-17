from django.db import models
from members.models import Member


class Donation(models.Model):
    """
    Represents a donation to the church.
    """
    TYPE_CHOICES = [
        ('Tithe', 'Tithe'),
        ('Offering', 'Offering'),
        ('Special Offering', 'Special Offering'),
        ('Pledge', 'Pledge'),
        ('Building Fund', 'Building Fund'),
        ('Missions', 'Missions'),
    ]
    
    METHOD_CHOICES = [
        ('Cash', 'Cash'),
        ('Bank Transfer', 'Bank Transfer'),
        ('M-Pesa', 'M-Pesa'),
        ('Cheque', 'Cheque'),
    ]
    
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Received', 'Received'),
    ]
    
    donor = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        related_name='donations',
        blank=True
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    donation_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='Tithe')
    method = models.CharField(max_length=50, choices=METHOD_CHOICES, default='Cash')
    date = models.DateField()
    reference = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Received')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.donor} - {self.amount} ({self.donation_type})"


class Giving(models.Model):
    """
    Represents church giving/tithe records.
    """
    CATEGORY_CHOICES = [
        ('Tithe', 'Tithe'),
        ('Offering', 'Offering'),
        ('Building Fund', 'Building Fund'),
        ('Missions', 'Missions'),
        ('Pledge', 'Pledge'),
    ]
    
    PERIOD_CHOICES = [
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
        ('Special', 'Special'),
    ]
    
    member = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        related_name='giving_records',
        blank=True
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Tithe')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='Monthly')
    receipt = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.member} - {self.amount} ({self.category})"
