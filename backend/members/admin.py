from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
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
