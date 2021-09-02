# Claro CRM Ventas - MicroKernel & MicroFrontend Monorepo Angular

La arquitectura web se basa en el patrón de diseño de micro kernel, el cual le permite distribuir soluciones comunes por medio de micro-kernels o micro-núcleos asociados a una tecnología (Angular, React, Vue, etc) pero que extienden dichas capacidades desde un kernel base desarrollado en JavaScript.

La arquitectura web basada en micro frontends o micro aplicaciones, es una composición de funcionalidades que se trabajan de manera independiente, permitiendo que sean más mantenibles y testeables, agnosticos a las tecnologías, y generando valor de inicio a fin.

Actualmente contamos con los siguientes artefactos:

#### 1. Claro Core

Es el núcleo base de la aplicación y contiene un conjunto de capacidades o soluciones a problemas comunes, que se presentan de manera recurrente en el desarrollo de aplicaciones WEB. Su diseño y desarrollo basado en JavaScript permite que sus soluciones puedan ser extendidas e implementados en distintos Framework (Angular, VueJs, ReactJS, etc.) de desarrollo de aplicaciones Frontend.

Claro Core tiene como objetivo, ser utilizado como kernel base para todas las aplicaciones web de Claro.

Contiene un conjunto de SDK's que agregan un valor agregado a las aplicaciones, a continuación se detallan las capacidades actuales:

* **SDK Encryptor**: Es una solución que permite la seguridad(cifrado) en los diferentes gestores de almacenamiento actuales (browser, traffic, etc), utilizando algoritmos basados en los estándares AES y RSA.
* **SDK Storage**: Es una solución que permite el manejo de almacenamiento de datos, mediante el uso de una interfaz común. Utiliza el SDK de encriptación para asegurar los datos, almacenando la información de forma encriptada.
* **SDK Logger**: Es una solución que permite tener una interfaz única para la generación de logs de acuerdo al nivel de incidencia, tanto en el cliente, como en el servidor. Utiliza el SDK Storage en su configuración para almacenar los datos de acceso del servidor de logs.
* **SDK Auth**: Es una solución que permite tener una interfaz única para la autenticación y autorización de las aplicaciones, independiente de la implementación de Oauth de turno así como del GrantType utilizado.Utiliza el SDK Storage en su configuración para almacenar los datos de acceso del servidor de autorización.
* **SDK Event Bus**: Es una solución que permite la propagación de eventos de la aplicación a través de un único canal, con el objetivo de centralizar la comunicación entre componentes, módulos y aplicaciones independientemente del framework o herramienta utilizada en el desarrollo.
* **SDK Message Bus**: Es una solución que permite la comunicación entre diferentes aplicaciones a través de una interfaz común, emitiendo y escuchando mensajes a través de diferentes canales y tópicos. Adicionalmente, permite persistir los mensajes almacenándolos en el localStorage de forma segura.
* **SDK Store**: Es una solución que permite facilitar el manejo de estados, mediante el uso de una interfaz común.


#### 2. Claro Commons

Es el núcleo o micro-kernel que extiende, adapta y disponibiliza las soluciones de Claro Core para ser usadas en proyectos Angulares.

Por otra parte Claro Commons tiene como responsabilidad el de distribuir soluciones comunes ([UI Components](./libs/commons/src/components/README.md), Directives, Helpers, Services, etc.) al desarrollo de aplicaciones angular, su objetivo es mejorar y dar soporte a las soluciones existentes para aplicaciones Angulares, así como seguir incorporando nuevas soluciones a demanda, conforme se vaya extendiendo en los diversos proyectos.

Claro Commons tiene como objetivo, ser utilizado como kernel base para todas las aplicaciones angular de Claro.


#### 3. Claro CRM Commons

Es el kernel base para el proyecto CRM Venta ONE Prepago.
Contiene las diversas soluciones comunes y a medida para todos los microapps del proyecto (UI Components, Enums, Global Constants, Helpers, Interfaces, Models, Services, etc.).


#### 4. Claro Styles

Es una guía de estilos base, que tiene como objetivo ser utilizada en el sistema de diseño de todas las aplicaciones de Claro.



## Pre-requisitos

Para poder utilizar la aplicación es necesario tener instaladas las siguientes herramientas:
* [GIT](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Angular CLI 9.1.2](https://cli.angular.io/)

Seguido a ello, debemos clonar el repositorio de nuestro proyecto.


## Instalación

```
cd path-to-project
npm ci
```


## Comandos

| Comando | Descripción |
|---------|-------------|
| npm start | Levanta un servidor de desarrollo de la aplicación principal shell |
| npm run start:login | Levanta un servidor de desarrollo del microapp login |
| npm run start:dashboard | Levanta un servidor de desarrollo del microapp dashboard |
| npm run start:customers | Levanta un servidor de desarrollo del microapp customers |
| npm run start:contracts | Levanta un servidor de desarrollo del microapp contracts |
| npm run start:biometric | Levanta un servidor de desarrollo del microapp biometric |
| npm run start:reports | Levanta un servidor de desarrollo del microapp reports |
| npm run start:sellers | Levanta un servidor de desarrollo del microapp sellers |
| npm run build:login | Compila el microapp login en la carpeta dist/ |
| npm run build:dashboard | Compila el microapp dashboard en la carpeta dist/ |
| npm run build:customers | Compila el microapp customers en la carpeta dist/ |
| npm run build:contracts | Compila el microapp contracts en la carpeta dist/ |
| npm run build:biometric | Compila el microapp reports en la carpeta dist/ |
| npm run build:reports | Compila el microapp biometric en la carpeta dist/ |
| npm run build:sellers | Compila el microapp sellers en la carpeta dist/ |
| npm run build:apps | Compila todas las microapps en la carpeta dist/ |
| npm run build | Compila la aplicación principal shell en la carpeta dist/ |
| npm run build:prod | Compila todo el proyecto shell en la carpeta dist/ |
| npm run build:dev | Compila todo el proyecto shell y lo levanta en un servidor http |

Para trabajar en el desarrollo de un microapp, se debe ejecutar (donde $microappName es el nombre del microapp a ejecutar)
```
npm run start:$microappName
```

Para trabajar desde la aplicación principal shell y ver toda la aplicación integral, se debe ejecutar
```
npm run build:apps
npm start
```



## Configuración de ambiente

| Parámetro | Descripción | Tipo (Valor) |
|-----------|-------------|--------------|
| production | Modo de compilación de la aplicación | boolean (false) |
| mock | Simula las peticiones y respuestas de los servicios http | boolean (true) |
| standalone | Verdadero para levantar un microapp independientemente, Falso para levantar toda la aplicación desde el shell | boolean (false) |
| api | URL de los servicios REST | string |
| cdn | URL donde se encontrarán los assets en el dominio/ip de la aplicación |

Está configuración, se encuentra en los siguientes archivos:
* projects/shell/src/environments/environment.ts
  > ambiente de desarrollo de los microapps en funionalidades
* projects/shell/src/environments/environment.prod.ts
  > ambiente de producción de los microapps en funionalidades
* projects/shell/src/environments/scss/_environment.scss
  > ambiente de desarrollo de los microapps en los estilos
* projects/shell/src/environments/scss-prod/_environment.scss
  > ambiente de producción de los microapps en los estilos
* libs/crm-commons/src/environments/environment.ts
  > único ambiente para los servicios del microkernel de la aplicación a ser usado por todos los microapps



## Parámetros configurables

Estos parámetros configurables de la aplicación, se encuentran en el siguiente archivo:
* projects/shell/src/assets/config/microapp.json

| Parámetro | Descripción |
|-----------|-------------|
| microApps | Listado detallado de los microapps del proyecto |
| credentials | client_id y client_secret enviados para generar el token de autorización |
| headers | Listado detallado de las cabeceras que serán enviadas en las solicitudes http |
| stateAuth | Nombre de la sesión de autorización a almacenarse en el localStorage del navegador |
| loginVerificationType | Parámetro - Tipo de verificación biométrica (1 = Local y RENIEC, 2 = Solo RENIEC, 3 = Solo Local) |



## Llave pública de encriptación del Login

En el formulario de identificación del asesor con su cuenta de red, el campo contraseña es enviado en transito de manera encriptada utilizando el algoritmo RSA 2048. La llave pública se encuentra en:
* projects/login/src/app/core/public-key.pem.ts



## Commits

Para garantizar una adecuada convención en los commits, utilizamos las reglas dadas por commitlint: https://www.npmjs.com/package/@commitlint/config-conventional.
````
npm install -g @commitlint/cli @commitlint/config-conventional
````

* feat: tipo de commit utilizado cuando se agrega o modifica una funcionalidad.
* fix: tipo de commit utilizado cuando se corrige un bug.
* refactor: tipo de commit utilizado cuando no se corrige un bug ni se agrega o modifica una funcionalidad.
* test: tipo de commit utilizado cuando se agregan o modifican pruebas.
* docs: tipo de commit utilizado cuando se realizan cambios en la documentación (readme, diagramas, etc).
* style: tipo de commit utilizado cuando se estiliza el código (espacios en blanco, formateo, puntos y comas, etc.).



## Revisión

Para poder asegurar en la medida de lo posible la calidad del código, es necesario utilizar TSLint.
````
npm run lint
````



## Autores

* **Ricardo García** - *Frontend Architect* - [rgarrodr@everis.com](mailto:rgarrodr@everis.com)
* **Cristian Ruiz** - *Frontend Developer* - [cruicast@everis.com](mailto:cruicast@everis.com)
* **Timoteo Rodríguez** - *Frontend Developer* - [trodrigc@everis.com](mailto:trodrigc@everis.com)
* **Anthony Juarez** - *Frontend Developer* - [ajuarezs@everis.com](mailto:ajuarezs@everis.com)
* **Lucero Hospina** - *Frontend Developer* - [lhospina@everis.com](mailto:lhospina@everis.com)
* **Michael Durand** - *Frontend Developer* - [mdurandv@everis.com](mailto:mdurandv@everis.com)




## Licencia
Este proyecto es propiedad intelectual de Claro. El uso sin autorización está prohibido.
