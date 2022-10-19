from django.urls import path
from .views import UserSettingsView

app_name = 'accounts'
urlpatterns = [
    path("accounts/settings", UserSettingsView.as_view(), name='user-settings')
]