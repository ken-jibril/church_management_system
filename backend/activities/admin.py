from django.contrib import admin
from .models import NewMemberRegistration, AdminLog, Event, Attendance

# 🔹 Admin for NewMemberRegistration
@admin.register(NewMemberRegistration)
class NewMemberRegistrationAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone_number', 'email', 'status', 'district', 'preferred_group', 'created_at')
    list_filter = ('status', 'district',)
    search_fields = ('first_name', 'last_name', 'phone_number', 'email')
    readonly_fields = ("status", "created_at")

    actions = ['approve_selected', 'reject_selected']

    def approve_selected(self, request, queryset):
        for registration in queryset.filter(status="pending"):
            registration.approve(request.user)

    approve_selected.short_description = "Approve selected registrations"


    def reject_selected(self, request, queryset):
        for registration in queryset.filter(status="pending"):
            registration.reject(request.user)

    reject_selected.short_description = "Reject selected registrations"


# 🔹 Admin for AdminLog
@admin.register(AdminLog)
class AdminLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'model_name', 'object_id', 'description', 'timestamp')
    list_filter = ('action', 'model_name', 'timestamp')
    search_fields = ('user__username', 'model_name', 'description')


# 🔹 Admin for Event
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'group', 'date', 'created_at')
    list_filter = ('group', 'date')
    search_fields = ('name',)


# 🔹 Admin for Attendance
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('event', 'member', 'attended')
    list_filter = ('event', 'attended')
    search_fields = ('member__username', 'event__name')
