from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from backend.accounts.models import Account


class AccountAdmin(UserAdmin):
    model = Account
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'date_joined', 'is_active',)
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups',)
    search_fields = ('email', 'first_name', 'last_name',)
    ordering = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'job_title', 'bio', 'profile_picture')}),
        ('Permissões', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Data Importantes', {'fields': ('last_login', 'date_joined', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'job_title', 'bio', 'profile_picture', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )

    readonly_fields = ('last_login', 'date_joined', 'updated_at')

admin.site.register(Account, AccountAdmin)
