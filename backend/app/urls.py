from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import get_bot_data, register_user, login_user, get_config, put_config, delete_config, exchange_info, exchange_assets


router = DefaultRouter()
urlpatterns = [
    path('data/', get_bot_data, name='get_bot_data'),
        
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    
    path('get_config/', get_config, name='get_config'),
    path('put_config/', put_config, name='put_config'),
    path('delete_config/', delete_config, name='delete_config'),
    path('exchange_info/', exchange_info, name='exchange_info'),
    path('exchange_assets/', exchange_assets, name='exchange_assets'),
    
]

