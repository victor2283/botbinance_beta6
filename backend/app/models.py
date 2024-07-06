# app/models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings

class Config(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    mode_Soft = models.BooleanField(default=True)
    symbol = models.CharField(max_length=55, default='BTCTRY', null=True, blank=True)
    asset_primary = models.CharField(max_length=10, default='BTC')
    asset_secundary = models.CharField(max_length=10, default='TRY')
    perc_binance = models.FloatField(default=0.167)
    sPd = models.FloatField(default=9)
    mPd = models.FloatField(default=18)  # sPd * 2
    lPd = models.FloatField(default=54)  # mPd * 3
    nbdevup = models.FloatField(default=2)
    nbdevdn = models.FloatField(default=2)
    perc_stopSide = models.FloatField(default=0.035)
    perc_priceSide = models.FloatField(default=0.018)
    api_key = models.CharField(max_length=255)
    api_secret = models.CharField(max_length=255)
    def __str__(self):
        return f"Config for {self.user.username}"
class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
