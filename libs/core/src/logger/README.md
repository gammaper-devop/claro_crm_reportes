# Logger

Logger es una solución que tiene como principal objetivo permitir a los desarrolladores tener una interfaz única para la generación de logs de acuerdo al nivel de incidencia, tanto en el cliente, como en el servidor.


## Pre-requisitos
Para poder utilizar o extender la librería es necesario tener instaladas las siguientes herramientas:
* Node 10+

Como primer paso debemos tener instalada la dependencia de @claro/js-core en nuestro proyecto (package.json)


## Instalación
```bash
$ cd path-to-project;
$ npm install @claro/js-core;
```


# Como Usar

El siguiente ejemplo práctico, muestra cómo realizar la configuración e implementación necesaria para utilizar Logger:

````javascript
import { ELoggerLevels, ILogger, ILoggerConfig, Logger } from '@claro/js-core';

class MyFirstClass {
  private logger: ILogger;

  constructor() {
    const loggerConfig: ILoggerConfig = {
      level: ELoggerLevels.DEBUG,
      i18nLang: 'en_US',
    };
    this.logger = new Logger(loggerConfig);
  }

  myFirstMethod() {
    this.logger.debug('mensaje');
  }

  mySecondMethod() {
    try {
      /*working*/
    } catch (e) {
      this.logger.error('mensaje', e);
    }
  }
}
````

## Api References

* Métodos

| Nombre | Descripción |
|--------|-------------|
| setHeader() | Usado al configurar envíos al servidor para asignar la cabecera de autorización |
| trace() | Registra una incidencia de rastreo de un color azul |
| debug() | Registra una incidencia de depuración de un color verde |
| info() | Registra una incidencia informativo de un color celeste |
| log() | Registra una incidencia estándar de un color gris |
| warn() | Registra una incidencia de advertencia de un color naranja |
| error() | Registra una incidencia de error de un color rojo |

* Interfaces

| Nombre | Descripción |
|--------|-------------|
| ILogger | Interfaz que contiene las definiciones a ser implementadas por la correspondiente clase |
| ILoggerConfig | Especifica una determinada configuración para el nivel de incidencia |

* Enums

| Atributo | Descripción | Valores |
|----------|-------------|--------------|
| ELoggerLevels | Permite especificar el nivel de incidencia a utilizar | 'TRACE', 'DEBUG', 'INFO', 'LOG', 'WARN', 'ERROR', 'OFF' |

* Configuración base

| Atributo | Descripción | Tipo (Valor) |
|----------|-------------|--------------|
| level | Nivel de incidencia permitido | ELoggerLevels (OFF) |
| secretKey | Llave secreta utilizada en el encriptamiento del token de autorización | STRING (obligatorio al usar serverLog) |
| serverLog | Objeto que contiene la URL del servidor donde se pueden registrar las incidencias | opcional |
| customLog | Objeto que contiene un método dado por el usuario donde se envían incidencias  | opcional |
| i18nLang | Idioma a utilizar en los mensajes de respuesta | STRING (es) |

### Caso Práctico

````javascript
import { Logger, ELoggerLevels } from '@claro/js-core';

const logger = new Logger({
  secretKey: 'YOUR_KEY',
  level: ELoggerLevels.TRACE,
  serverLog: { url: 'http://localhost:3000/log' },
});

...
if (!authInstance.isAuthenticated()) {
  const response = authInstance.authenticate({
    username: 'email@claro.com',
    password: '123456',
  });
  response.then((response: any) => {
    this.logger.setHeader(
      authInstance.getToken(),
      'Authorization',
      'Bearer',
    );
    logger.debug('login response:', response);
  });
} else {
  logger.trace('user token:', authInstance.getToken());
  if (authInstance.isExpired()) {
    authInstance.clean();
    logger.info('logout!');
  }
}
...
````


# Contribución

## Revisión
Para poder asegurar en la medida de lo posible la calidad del código, es necesario utilizar TSLint.
````javascript
$ npm run lint
````

## Pruebas

### Unit testing

Es necesario asegurar que los unit tests contemplen los escenarios posibles de las funciones cubiertas.
| Como recomendación, se sugiere tener un code coverage por encima del 70%,
Los tests de la aplicación se ejecutan a través del comando,
````javascript
$ npm run test
````


## Autores

* **Jefferson Lara** - *Initial work* - [jlaramol@everis.com](jlaramol@everis.com)
* **Ricardo García** - *Initial work* - [rgarrodr@everis.com](rgarrodr@everis.com)

Vea también la lista de [contributors]() que participaron en este proyecto.


## Licencia
Este proyecto es propiedad intelectual de EVERIS. El uso sin autorización está prohibido. Revise el archivo [LICENSE.md]() para mayor detalles.
