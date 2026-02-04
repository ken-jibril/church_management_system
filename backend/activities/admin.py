from django.contrib import admin
from .models import NewMemberRegistration


@admin.register(NewMemberRegistration)
class NewMemberRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "phone_number",
        "district",
        "status",
        "created_at",
    )

    list_filter = ("status", "district")
    search_fields = ("first_name", "last_name", "phone_number")
    ordering = ("-created_at",)

    actions = ["approve_selected", "reject_selected"]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_super_admin:
            return qs  # full view for you
        # Parish minister + Kirk Session see approved/rejected only
        return qs.exclude(status='pending')


    def has_delete_permission(self, request, obj=None):
        # Nobody deletes registrations — ever
        return False

    def approve_selected(self, request, queryset):
        for registration in queryset.filter(status="pending"):
            registration.approve(request.user)

        self.message_user(request, "Selected registrations approved successfully.")

    approve_selected.short_description = "Approve selected registrations"

    def reject_selected(self, request, queryset):
        for registration in queryset.filter(status="pending"):
            registration.reject(request.user)

        self.message_user(request, "Selected registrations rejected.")

    reject_selected.short_description = "Reject selected registrations"
