from rest_framework import serializers
from backend.accounts.models import Account


# class AccountRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = Account
#         fields = ('email', 'first_name', 'last_name', 'password')

#     def create(self, validated_data):
#         user = Account.objects.create_user(
#             email=validated_data['email'],
#             first_name=validated_data['first_name'],
#             last_name=validated_data['last_name'],
#             password=validated_data['password']
#         )
#         return user


class AccountLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class AccountProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            'email',
            'first_name',
            'last_name',
            'job_title',
            'bio',
            'profile_picture',
            'timezone'
        )
        read_only_fields = ('email',)
