from django.shortcuts import render, redirect
from .forms import MemberRegistrationForm

def register_member(request):
    if request.method == 'POST':
        form = MemberRegistrationForm(request.POST)
        if form.is_valid():
            member = form.save(commit=False)
            # Default roles for new members
            member.is_super_admin = False
            member.is_parish_minister = False
            member.is_kirk_session = False
            member.save()
            return redirect('login')  # or wherever you want
    else:
        form = MemberRegistrationForm()
    return render(request, 'members/register.html', {'form': form})
