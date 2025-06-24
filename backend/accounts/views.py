from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login
from .serializers import (
    AccountRegistrationSerializer,
    AccountLoginSerializer,
    AccountProfileSerializer
)
from .models import Account


class AccountRegistrationView(APIView):
    def post(self, request):
        serializer = AccountRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountLoginView(APIView):
    def post(self, request):
        serializer = AccountLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            return Response(
                {'error': 'Credenciais inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountProfileView(generics.RetrieveUpdateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
