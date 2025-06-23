import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _


class AccountManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_(' O campo de E-mail é obrigatório'))
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superusuário deve ter is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superusuário deve ter is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)


class Account(AbstractUser):
    username = None
    email = models.EmailField(
        _('endereço de e-mail'),
        unique=True
    )
    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    job_title = models.CharField(
        _("Cargo"),
        max_length=100,
        blank=True
    )
    bio = models.TextField(
        _("Sobre"),
        blank=True
    )
    profile_picture = models.ImageField(
        _("Foto de perfil"),
        upload_to='profile_pics/',
        null=True,
        blank=True
    )
    timezone = models.CharField(
        max_length=50,
        default='America/Porto_Velho'
    )
    updated_at = models.DateTimeField(
        _("Atualizado em"),
        auto_now=True
    )
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="account_set",
        related_query_name="account",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="account_set",
        related_query_name="account",
    )

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = []

    objects = AccountManager()

    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
