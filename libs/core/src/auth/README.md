# Auth Manager

El Auth Manager es una solución que tiene como principal objetivo permitir a los desarrolladores tener una interfaz única para la autenticación y autorización de las aplicaciones, independiente de la implementación de Oauth de turno (Oauth2.0, Azure AD, Amazon Cognito, etc) así como del GrantType utilizado (para el caso de Oauth 2.0, según el estándar RFC).

Actualmente contamos con las siguientes integraciones:

1. OAuth2
> * GranType Password


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

El siguiente ejemplo práctico, muestra cómo realizar la configuración necesaria para utilizar el módulo de Autenticación, empleando el estándar OAuth 2.0 y el GrantType Password:

````javascript
import { AuthenticationFactory, EAuthorizationType, EGrantType, IAuthConfig, IOAuth2Config } from '@claro/js-core';

const oAuth2Config: IOAuth2Config = {
  grantType: EGrantType.PASSWORD,
  authUrl: 'http://localhost:3000/login',
  secretKey: 'YOUR_KEY',
  client_id: 'application',
  client_secret: 'secret',
  i18nLang:'en_US',
};

const authConfig: IAuthConfig = {
  authType: EAuthorizationType.OAUTH2,
  config: oAuth2Config,
};

const provider = new AuthenticationFactory(authConfig);

const response = provider.authInstance.authenticate({
  username: 'frontend',
  password: 'password',
});
response.then((response: any) => {
  console.log(response);
});
````

## Api References

* Métodos

| Nombre | Descripción |
|--------|-------------|
| authenticate() | Ejecuta la llamada de autenticación hacia el servidor de autorización |
| getToken() | Retorna el token de autorización para ser utilizado en las cabeceras http |
| isAuthenticated() | Retorna verdadero si existe una sesión de autenticación |
| isExpired() | Retorna verdadero si el tiempo de la sesión de autenticación ya ha expirado |
| clean() | Limpia la sesión de autenticación |

* Interfaces

| Nombre | Descripción |
|--------|-------------|
| AuthenticationFactory | Clase que crea una instancia para el manejo de autenticación dependiendo del tipo configuración enviado |
| IAuthConfig | Especifica el tipo de autorización a realizar y su configuración correspondiente |
| IOAuth2Config | Contrato de configuración esperado por la especificación de OAuth2 |
| IAzureConfig | Contrato de configuración esperado por la especificación de Azure AD |

* Enums

| Nombre | Descripción |
|--------|-------------|
| EAuthorizationType | Permite especificar el tipo de autorización |
| EGrantType | Permite especificar el Tipo de Grant para el estándar OAuth2 |

1. Tipos de Autorización
> * Oauth 2.0
> * Azure AD
> * AWS
> * Altemista

2. Tipos de Grant
> * Grant Type Authorization Code
> * Grant Type Password
> * Grant Type Implicit
> * Grant Type Client Credentials

* Configuración base opcional

| Atributo | Descripción | Tipo (Valor) |
|----------|-------------|--------------|
| secretKey | Llave secreta utilizada en el encriptamiento de datos al almacenarlos | STRING (obligatorio) |
| headerName | Nombre de la cabecera para enviar el access token en el interceptor de autorización | STRING (Authorization) |
| tokenType | Tipo de token a enviar en el interceptor de autorización | STRING (Bearer) |
| storageType | Tipo de almacenamiento a utilizar proveniente del Storage Module | ENUM EStorageType (LocalStorage) |
| responseModel | Datos de respuesta personalizados dependiendo del tipo de autenticación | TYPE IPasswordGrantModel. (RFC values) |
| i18nLang | Idioma a utilizar en los mensajes de respuesta | STRING (es) |
| interceptor | Si es verdadero, crea un http interceptor para enviar el access token en la cabecera | BOOLEAN (false) |

* Configuración para Autenticación OAuth2

| Atributo | Descripción | Tipo (Valor) |
|----------|-------------|--------------|
| grantType | Tipo de flujo a utilizar | ENUM EGrantType (obligatorio) |
| authUrl | Dirección url del servicio de autenticación | STRING (obligatorio) |
| client_id | Identificador del cliente del servidor de autorización | STRING (opcional) |
| client_secret | Clave secreta proporcionada por el servidor de autorización | STRING (opcional) |
| requestType | Tipo de petición enviada al servidor | ENUM EResponseType (Form URL Encoded) |
| responseType | Tipo de respuesta enviada del servidor | ENUM EResponseType (JSON) |

### Caso Práctico

````javascript
...
let oAuth2Config: IOAuth2Config;
oAuth2Config = {
 grantType: EGrantType.PASSWORD,
 authUrl: 'http://localhost:3000/login',
 secretKey: 'YOUR_KEY',
 client_id: 'application',
 client_secret: 'secret',
 responseModel: {
   access_token: 'accessToken',
   token_type: 'tokenType',
   expires_in: 'accessTokenExpiresAt',
   refresh_token: 'refreshToken'
 },
 i18nLang: 'en_US'
};
...
const authInstance = provider.authInstance;
...
if (!authInstance.isAuthenticated()) {
  const response = authInstance.authenticate({
    username: 'email@claro.com',
    password: '123456',
  });
  response.then((response: any) => {
    console.log('login response:', response);
  });
} else {
  console.log('user token:', authInstance.getToken());
  if (authInstance.isExpired()) {
    authInstance.clean();
    console.log('logout!');
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


## Referencia
Para la construcción de este modulo se tomo de referencia las siguientes fuentes web:
* [Official Site](https://oauth.net/2/)
* [IETF RFC 6749](https://tools.ietf.org/html/rfc6749)


## Autores

* **Jefferson Lara** - *Initial work* - [jlaramol@everis.com](jlaramol@everis.com)
* **Ricardo García** - *Initial work* - [rgarrodr@everis.com](rgarrodr@everis.com)
* **Jose Leon** - *Initial work* - [jleonram@everis.com](jleoramo@everis.com)

Vea también la lista de [contributors]() que participaron en este proyecto.


## Licencia
Este proyecto es propiedad intelectual de EVERIS. El uso sin autorización está prohibido. Revise el archivo [LICENSE.md]() para mayor detalles.
