Requisitos:

Base de datos MariaDB/MySQL
nodejs
Workbench mysql (para no tener que aplicar los sql desde consola)


Instalación:
1)  crear la carpeta dist en el directorio raíz.
2)  ejecutar el comando 'npm install' o 'npm i' (que es el mismo comando abreviado).
    Se instalarán los node modules.
3)  implementar la base de datos, primero el archivo 'database_queries/database.sql',
    luego se pueden implementar los procedimientos de cada entidad.
4)  configurar el archivo .env (archivo mandado por whatsapp)

Para ejecutar el programa en modo prueba:
Se deben abrir 2 consolas, ambas en el directorio raíz del proyecto.
En una se ejecuta el comando: 
    npm run listen 

esto se queda a la escucha de los cambios en los archivos TS, para compilarlo a JS en tiempo real.

En la otra consola, se ejecuta el comando:
    npm run test

Esto ejecuta el nodemon, que revisa la carpeta con el proyecto compilado ('dist/')
cada cambio nuevo se ejecuta en pantalla.

