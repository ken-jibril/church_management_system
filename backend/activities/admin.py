from django.contrib import admin
from .models import NewMemberRegistration, AdminLog, Event, Attendance

# 🔹 Admin for NewMemberRegistration
@admin.register(NewMemberRegistration)
class NewMemberRegistrationAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone_number', 'email', 'status', 'district', 'preferred_group', 'created_at')
    list_filter = ('status', 'district', 'preferred_group', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone_number', 'email')
    actions = ['approve_selected', 'reject_selected']

    def approve_selected(self, request, queryset):
        """
        Approve multiple selected pending members.
        Only super admin or delegated user should perform this.
        """
        from members.models import Member

        for registration in queryset:
            try:
                registration.approve(request.user)
                self.message_user(request, f"Approved {registration.first_name} {registration.last_name}")
            except PermissionError as e:
                self.message_user(request, f"Cannot approve {registration.first_name}: {str(e)}", level='error')
    approve_selected.short_description = "Approve selected pending members"

    def reject_selected(self, request, queryset):
        """
        Reject multiple selected pending members.
        """
        for registration in queryset:
            try:
                registration.reject(request.user)
                self.message_user(request, f"Rejected {registration.first_name} {registration.last_name}")
            except PermissionError as e:
                self.message_user(request, f"Cannot reject {registration.first_name}: {str(e)}", level='error')
    reject_selected.short_description = "Reject selected pending members"


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
