from rest_framework import serializers
from .models import CustomUser, Config

class ConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = [
            'symbol',
            'api_key',
            'api_secret',
            'asset_primary',
            'asset_secundary',
            'perc_binance',
            'sPd',
            'mPd',
            'lPd',
            'nbdevup',
            'nbdevdn',
            'perc_stopSide',
            'perc_priceSide',
            'mode_Soft'
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username')
