from django.urls import path
from backend.accounts.views import (AccountProfileView)

urlpatterns = [
    # path('register/', AccountRegistrationView.as_view(), name='register'),
    path('profile/', AccountProfileView.as_view(), name='profile'),
]
