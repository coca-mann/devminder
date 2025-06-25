from django.urls import path
from backend.accounts.views import (
    # AccountRegistrationView,
    AccountLoginView,
    AccountProfileView
)

urlpatterns = [
    # path('register/', AccountRegistrationView.as_view(), name='register'),
    path('login/', AccountLoginView.as_view(), name='login'),
    path('profile/', AccountProfileView.as_view(), name='profile'),
]
