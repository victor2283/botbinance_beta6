# botbinance_beta6
Realice una app web que se puede usar en escritorio de cualquier sistema operativo, totalmente desarrollado en python con uso de djando y react js.
Antes de empezar los paquetes de python necesarios son: 
* binance-connector==3.6.0,
* Django==5.0.6,
* django-cors-headers==4.3.1,
* djangorestframework==3.15.1,
* numpy==1.26.4,
* pandas==2.2.2,
1. puede usar directamente el comando pip install binance-connector Django django-cors-headers djangorestframework numpy pandas
2. ahora posicionece en la carpeta backend y ejecture las migraciones con:
2.1.  python manage.py makemigrations
2.2. python manage.py migrate
3. como ya compile los archivos de react en este momento estando ubicado en la carpeta raiz del proyecto llamado binance o con el nombre que decida que sea donde tiene lod directorios backend y frontend instalados ejecute el arcvhivo nav.py escriendo en consola py nav.py, esto va a ejecutar todo el proyecto abriendo una ventana de navegacion web creada por mi que ejecuta ademas el servidor web en su pc y en esta ventana vera el proyecto activo y debera loguearse creando una cuenta de usuario con passowrd y email y poner su clave api key y api secret en la pestaña configuracion de menu inicio, una vez que esto este funcionando en configuracion debera  elegir el par que va a comercializar en binance o el que tenga saldo disponible por ejemplo si tiene usdt y quiere comprar y vender btc. Otra manera de ejecutar el proyecto es la siguiente.... 1. posicionado en la carpeta frontend ejecute npm install y luego npm run start para que la parte frontend se abra en el navegador web de su preferencia en el puerto localhost:3000 y luego posicionece en la ruta backend y ejecute py manage.py runserver "esto activara el servidor web de django en el puerto 8000". Si te gusto mi programa y quieres hacer una donacion puedes hacerlo al correo victor2283@gmail.com desde un dolar en cualquier moneda extranjera a mi billetera de binance , airtm, skill o puedes escribirme al mismo correo para solicitarme la cuenta bancaria internacional a la que podrias realizar tu transferencia.
   ![Texto alternativo]([React-App (2).jpg](https://github.com/victor2283/botbinance_beta6/blob/main/React-App%20(2).jpg))


