from django import forms
from .models import Member
from django.contrib.auth.forms import UserCreationForm

class MemberRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone_number = forms.CharField(required=False)

    class Meta:
        model = Member
        fields = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'password1', 'password2']
