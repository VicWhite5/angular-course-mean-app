# MEAN App

Este repositorio aloja el MEAN App del curso de Angular de Fernando Herrera

## Instalación y ejecución

Primero es neceasario clonar el repositorio.

### Backend

1. Copiar el ```env.template```, renonmbrarlo a ```.env```, y agregar lo que este necesita

2. Ejecutar ```docker compose up -d```

3. Instalar las dependencias: ```npm install```

4. Para correr el servidor: ```npm run start:dev```

### Frontend

>Para el frontend, solamente es necsario una variable de entorno, la cual es la del url del backend. Por lo que es necesario crear el directorio de environments.

1. Para correr ```ng serve -o```.