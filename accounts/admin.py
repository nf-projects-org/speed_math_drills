from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import SmdUserChangeForm, SmdUserCreationForm

SmdUser = get_user_model()

class SmdUserAdmin(UserAdmin):
    add_form = SmdUserCreationForm
    form = SmdUserChangeForm
    model = SmdUser
    list_display = [
        "email", "username", "is_superuser",
    ]

admin.site.register(SmdUser, SmdUserAdmin)

