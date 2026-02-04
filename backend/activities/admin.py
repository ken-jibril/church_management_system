from django.contrib import admin
from .models import NewMemberRegistration, AdminLog, Event, Attendance


@admin.register(NewMemberRegistration)
class NewMemberRegistrationAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "status", "district", "preferred_group", "created_at")
    list_filter = ("status", "district", "preferred_group")
    search_fields = ("first_name", "last_name", "email", "phone_number")


@admin.register(AdminLog)
class AdminLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "model_name", "object_id", "timestamp")
    list_filter = ("action", "model_name")
    search_fields = ("user__username", "model_name", "description")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("name", "group", "date", "created_at")
    list_filter = ("group", "date")
    search_fields = ("name",)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("member", "event", "attended")
    list_filter = ("attended", "event")
    search_fields = ("member__username", "event__name")
