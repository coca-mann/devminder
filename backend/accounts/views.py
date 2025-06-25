from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from backend.accounts.serializers import (AccountProfileSerializer)
from backend.accounts.models import Account


class AccountProfileView(generics.RetrieveUpdateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user