import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .serializers import UserSerializer, ConfigSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import User
import json
from rest_framework import status
from .models import Config
from pprint import pprint 
from .bot import BotBinance

bot = None
def create_bot_instance(api_key, api_secret, mode_Soft, asset_primary, asset_secundary, symbol, perc_binance, sPd, mPd, lPd, nbdevup, nbdevdn, perc_stopSide, perc_priceSide):
    global bot
    bot = BotBinance(symbol=symbol,
                      asset_primary=asset_primary, 
                      asset_secundary=asset_secundary, 
                      mode_Soft=mode_Soft, 
                      interval='1m', 
                      limit=300, 
                      sPd=sPd, 
                      mPd=mPd, 
                      lPd=lPd, 
                      perc_binance=perc_binance, 
                      perc_stopSide=perc_stopSide, 
                      perc_priceSide=perc_priceSide, 
                      nbdevup=nbdevup, 
                      nbdevdn=nbdevdn, 
                      api_key=api_key, 
                      api_secret=api_secret)


User = get_user_model()

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            return JsonResponse({'error': 'All fields are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        user =  User.objects.create_user(username=username, email=email, password=password)
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        }
        return JsonResponse({'message': 'User registered successfully', 'user': user_data}, status=201)
    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        user = authenticate(request, email=email, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'token': token.key, 'user': UserSerializer(user).data, 'created': created}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)

def get_user_from_token(request):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            token_key = auth_header.split(' ')[1]  # Obtener el token del encabezado
            token = Token.objects.get(key=token_key)
            return token.user
        except Token.DoesNotExist:
            return None  # No hay token válido
    return None  # No hay encabezado de autorización


@csrf_exempt
def get_config(request):
    user = get_user_from_token(request)
    if user is None:
        return JsonResponse({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        api_key = Config.objects.get(user=user)
        serializer = ConfigSerializer(api_key)
        create_bot_instance(api_key=serializer.data['api_key'], api_secret=serializer.data['api_secret'], mode_Soft = serializer.data['mode_Soft'], asset_primary= serializer.data['asset_primary'], asset_secundary=serializer.data['asset_secundary'], symbol=serializer.data['symbol'], perc_binance=serializer.data['perc_binance'], sPd=serializer.data['sPd'], mPd=serializer.data['mPd'], lPd=serializer.data['lPd'], nbdevup=serializer.data['nbdevup'], nbdevdn=serializer.data['nbdevdn'], perc_stopSide=serializer.data['perc_stopSide'], perc_priceSide=serializer.data['perc_priceSide'])
        return JsonResponse(serializer.data)
    except Config.DoesNotExist:
        create_bot_instance(api_key="", api_secret="", mode_Soft = True, asset_primary= "", asset_secundary="", symbol="", perc_binance=0.167, sPd=9, mPd=18, lPd=54,nbdevup=2, nbdevdn=2, perc_stopSide=0.035, perc_priceSide=0.018)
        return JsonResponse({'error': 'Config does not exist'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
def put_config(request):
    user = get_user_from_token(request)
    if user is None:
        return JsonResponse({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    data = json.loads(request.body)
    try:
        api_key = Config.objects.get(user=user)
        serializer = ConfigSerializer(api_key, data=data)
    except Config.DoesNotExist:
        serializer = ConfigSerializer(data=data)
        
    if serializer.is_valid():
        serializer.save(user=user)
        return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def delete_config(request):
    user = get_user_from_token(request)
    if user is None:
        return JsonResponse({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        api_key = Config.objects.get(user=user)
        api_key.delete()
        create_bot_instance(api_key="", api_secret="", mode_Soft = True, asset_primary= "", asset_secundary="", symbol="", perc_binance=0.167, sPd=9, mPd=18, lPd=54,nbdevup=2, nbdevdn=2, perc_stopSide=0.035, perc_priceSide=0.018)
        return JsonResponse({'message': 'Config deleted'}, status=status.HTTP_204_NO_CONTENT)
    except Config.DoesNotExist:
        return JsonResponse({'error': 'Config does not exist'}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
def exchange_assets(request):
    user = get_user_from_token(request)
    if user is None:
        return JsonResponse({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    if bot is None:
        try:
            api_key = Config.objects.get(user=user)
            serializer = ConfigSerializer(api_key)
            create_bot_instance(api_key=serializer.data['api_key'], api_secret=serializer.data['api_secret'])
            
        except Config.DoesNotExist:
           create_bot_instance(api_key="", api_secret="", mode_Soft = True, asset_primary= "", asset_secundary="", symbol="", perc_binance=0.167, sPd=9, mPd=18, lPd=54,nbdevup=2, nbdevdn=2, perc_stopSide=0.035, perc_priceSide=0.018)
           print('error, Config does not exist') 
    
    if request.method == 'GET':
        try:
            symbol_filter = request.GET.get('symbol', '').upper()
            exchange_info = bot.exchange_info(symbol=symbol_filter)
            return JsonResponse(exchange_info, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
@csrf_exempt
def exchange_info(request):
    user = get_user_from_token(request)
    if user is None:
        return JsonResponse({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    if bot is None:
        try:
            api_key = Config.objects.get(user=user)
            serializer = ConfigSerializer(api_key)
            create_bot_instance(api_key=serializer.data['api_key'], api_secret=serializer.data['api_secret'], mode_Soft = serializer.data['mode_Soft'], asset_primary= serializer.data['asset_primary'], asset_secundary=serializer.data['asset_secundary'], symbol=serializer.data['symbol'], perc_binance=serializer.data['perc_binance'], sPd=serializer.data['sPd'], mPd=serializer.data['mPd'], lPd=serializer.data['lPd'], nbdevup=serializer.data['nbdevup'], nbdevdn=serializer.data['nbdevdn'], perc_stopSide=serializer.data['perc_stopSide'], perc_priceSide=serializer.data['perc_priceSide'])
        except Config.DoesNotExist:
            create_bot_instance(api_key="", api_secret="", mode_Soft = True, asset_primary= "", asset_secundary="", symbol="", perc_binance=0.167, sPd=9, mPd=18, lPd=54,nbdevup=2, nbdevdn=2, perc_stopSide=0.035, perc_priceSide=0.018)
            print('error, Config does not exist') 
    
    if request.method == 'GET':
        try:
            symbol_filter = request.GET.get('symbol', '').upper()
            exchange_info = bot.exchange_info()
            symbols = [s['symbol'] for s in exchange_info['symbols'] if symbol_filter in s['symbol']]
            if not symbols:
                return JsonResponse({'error': 'No symbols found'}, status=404)
                
            return JsonResponse({'symbols': symbols}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_bot_data(request):
    user = get_user_from_token(request)
    if user is None:
        return JsonResponse({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    api_key = Config.objects.get(user=user)
    serializer = ConfigSerializer(api_key)
    if bot is None:
        try:
            create_bot_instance(api_key=serializer.data['api_key'], api_secret=serializer.data['api_secret'], mode_Soft = serializer.data['mode_Soft'], asset_primary= serializer.data['asset_primary'], asset_secundary=serializer.data['asset_secundary'], symbol=serializer.data['symbol'], perc_binance=serializer.data['perc_binance'], sPd=serializer.data['sPd'], mPd=serializer.data['mPd'], lPd=serializer.data['lPd'], nbdevup=serializer.data['nbdevup'], nbdevdn=serializer.data['nbdevdn'], perc_stopSide=serializer.data['perc_stopSide'], perc_priceSide=serializer.data['perc_priceSide'])
        except Config.DoesNotExist:
            print('error, Config does not exist') 
    elif bot.asset_secundary != serializer.data['asset_secundary']:    
        pprint(f"bot.asset_secundary: {bot.asset_secundary}")
        try:
            create_bot_instance(api_key=serializer.data['api_key'], api_secret=serializer.data['api_secret'], mode_Soft = serializer.data['mode_Soft'], asset_primary= serializer.data['asset_primary'], asset_secundary=serializer.data['asset_secundary'], symbol=serializer.data['symbol'], perc_binance=serializer.data['perc_binance'], sPd=serializer.data['sPd'], mPd=serializer.data['mPd'], lPd=serializer.data['lPd'], nbdevup=serializer.data['nbdevup'], nbdevdn=serializer.data['nbdevdn'], perc_stopSide=serializer.data['perc_stopSide'], perc_priceSide=serializer.data['perc_priceSide'])
        except Config.DoesNotExist:
            print('error, Config does not exist') 
    data = bot.update_data()
    data_1= {
            'ear': data['ear'],  
            'alerts': data['alerts'],
            'msg': data['msg'],
            'price_market': data['price_market'],
            'last_price_market': data['last_price_market'],
            'candles': data['candles'],
            'smaS':data['smaS'],
            'smaM':data['smaM'],
            'smaL':data['smaL'],
            'closes':data['closes'],
            'upperband':json.loads(data['upperband'].to_json()),
            'middleband':json.loads(data['middleband'].to_json()),
            'lowerband':json.loads(data['lowerband'].to_json()),
            'rsi':json.loads(data['rsi'].to_json()),
            'mfi':json.loads(data['mfi'].to_json()),
            'macd':json.loads(data['macd'].to_json()),
            'macdsignal':json.loads(data['macdsignal'].to_json()),
            'macdhist':json.loads(data['macdhist'].to_json()),
            
        }
    return  JsonResponse(data_1)
