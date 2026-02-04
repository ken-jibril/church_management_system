from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Count
from .models import Member


@admin.register(Member)
class MemberAdmin(UserAdmin):
    model = Member

    list_display = (
        'username',
        'first_name',
        'last_name',
        'phone_number',
        'district',
        'is_super_admin',
        'is_parish_minister',
        'is_kirk_session',
        'can_approve_pending',
        'is_active',
    )

    list_filter = (
        'district',
        'is_super_admin',
        'is_parish_minister',
        'is_kirk_session',
        'can_approve_pending',
        'is_active',
    )

    fieldsets = UserAdmin.fieldsets + (
        ('Church Roles', {
            'fields': (
                'phone_number',
                'district',
                'is_super_admin',
                'is_parish_minister',
                'is_kirk_session',
                'can_approve_pending',
            )
        }),
    )

    search_fields = ('username', 'first_name', 'last_name', 'phone_number')

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}

        # Add total members and district breakdown for leaders
        extra_context["total_members"] = Member.objects.count()
        extra_context["by_district"] = (
            Member.objects
            .values("district__name")
            .annotate(count=Count("id"))
        )

        return super().changelist_view(request, extra_context=extra_context)
