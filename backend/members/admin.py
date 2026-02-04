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

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        # Super admin sees everything
        if request.user.is_super_admin:
            return qs

        # Parish minister and Kirk session see all members (overview)
        if request.user.is_parish_minister or request.user.is_kirk_session:
            return qs

        # Regular members: limit to their groups and basic member info
        return qs.filter(
            groups__in=request.user.groups.all()  # only members in the same groups
        ).distinct()

