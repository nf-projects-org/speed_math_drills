from django.contrib.auth.models import AbstractUser
from django.db import models


class SmdUser(AbstractUser):
    is_premium = models.BooleanField(default=False,blank=False)
