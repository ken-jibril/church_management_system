from django.apps import AppConfig


class MembersConfig(AppConfig):
    name = 'members'
    
    def ready(self):
        """Create default superuser when app is ready"""
        self.create_superuser()
    
    def create_superuser(self):
        """Create default superuser if none exists"""
        try:
            from .models import Member
            if not Member.objects.filter(is_super_admin=True).exists():
                Member.objects.create_superuser(
                    username='Ken',
                    email='jibken80@gmail.com',
                    password='Tp051101294za',
                    is_super_admin=True,
                    can_approve_pending=True,
                    first_name='Kennedy',
                    last_name='Kagai'
                )
                print("✅ Default superuser created: Ken / jibken80@gmail.com")
        except Exception as e:
            print(f"⚠️  Could not create superuser: {e}")
