from django.core.management.base import BaseCommand
from django.core.management import execute_from_command_line
import sys


class Command(BaseCommand):
    help = 'Run all database migrations'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting migrations...'))
        
        # Run migrations for all apps
        try:
            execute_from_command_line(['manage.py', 'migrate', '--verbosity=2'])
            self.stdout.write(self.style.SUCCESS('✓ Migrations completed successfully!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Migration failed: {str(e)}'))
            sys.exit(1)
