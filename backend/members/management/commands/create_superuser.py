# Management command to create superuser
# Run with: python manage.py create_superuser

from django.core.management.base import BaseCommand
from members.models import Member

class Command(BaseCommand):
    help = 'Creates a superuser with the specified credentials'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, required=True)
        parser.add_argument('--email', type=str, required=True)
        parser.add_argument('--password', type=str, required=True)

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']

        # Check if user already exists
        if Member.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR(f'User "{username}" already exists!'))
            return

        # Create superuser with all roles
        user = Member.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_superuser=True,
            is_super_admin=True,
            is_parish_minister=False,
            is_kirk_session=False,
            can_approve_pending=True,
            first_name='Ken',
            last_name='Administrator'
        )

        self.stdout.write(self.style.SUCCESS(f'Successfully created superuser: {username}'))
        self.stdout.write(self.style.SUCCESS(f'Roles: is_superuser=True, is_super_admin=True'))
