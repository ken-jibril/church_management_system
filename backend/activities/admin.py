from django.contrib import admin
from .models import NewMemberRegistration, AdminLog, Event, Attendance

# Register your models here.

admin.site.register(NewMemberRegistration)
admin.site.register(AdminLog)
admin.site.register(Event)
admin.site.register(Attendance)