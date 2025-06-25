from rest_framework import serializers
from backend.accounts.models import Account

class AccountProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            'id', 'email', 'first_name', 'last_name', 'job_title',
            'bio', 'profile_picture', 'timezone'
        )
        read_only_fields = ('email', 'id')
