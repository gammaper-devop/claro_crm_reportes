# Storage Manager

El Storage Manager es una solución que tiene como principal objetivo facilitar a los desarrolladores el manejo de almacenamiento de datos, mediante el uso de una interfaz común. Adicionalmente, asegura los datos, almacenando la información de forma encriptada, utilizando el estándar de encriptación simétrica AES.

Actualmente contamos con las siguientes opciones de almacenamiento:

1. Browser Storage
> * Local Storage
> * Session Storage

2. Memory Storage

![logo](\src\storage\uml\StorageModel.png)


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

El siguiente ejemplo práctico, muestra cómo realizar la configuración e implementación necesaria para utilizar el módulo de Almacenamiento, empleando en este caso localStorage:

````javascript
import {
  EStorageType,
  IStorage,
  IStorageConfig,
  storage,
} from '@claro/js-core';

class MyFirstClass {
  private localStorage: IStorage;

  constructor() {
    const storageConfig: IStorageConfig = {
      storageType: EStorageType.LOCAL,
      secretKey: 'YOUR_KEY',
    };
    this.localStorage = storage(storageConfig);
  }

  myFirstMethod() {
    var data = { hello: 'world' };
    this.localStorage.set('key', data);
    return data;
  }
}
````

## Api References

* Métodos

| Nombre | Descripción |
|--------|-------------|
| set() | Almacena la información asociada a la clave dada |
| get() | Obtiene la información correspondiente a la clave dada |
| remove() | Elimina la información asociada a la clave dada |
| clear() | Limpia todo el contenido del almacenamiento actual |

* Interfaces

| Nombre | Descripción |
|--------|-------------|
| storage() | Método que crea una instancia para el manejo de almacenamiento dependiendo de la configuración enviada |
| IStorage | Interfaz que contiene las definiciones a ser implementadas por la correspondiente clase |
| IStorageConfig | Especifica una determinada configuración para crear un tipo de almacenamiento |

* Enums

| Nombre | Descripción |
|--------|-------------|
| EStorageType | Permite especificar el tipo de almacenamiento a utilizar |

* Configuración base

| Atributo | Descripción | Tipo (Valor) |
|----------|-------------|--------------|
| secretKey | Llave secreta utilizada en el encriptamiento de datos al almacenarlos | STRING (obligatorio) |
| storageType | Tipo de almacenamiento a utilizar proveniente del Storage Module | ENUM EStorageType (LocalStorage) |
| i18nLang | Idioma a utilizar en los mensajes de respuesta | STRING (es) |

### Caso Práctico

````javascript
import { EStorageType, IStorage, storage } from '@claro/js-core';

const localStorage: IStorage = storage({ storageType: EStorageType.LOCAL, secretKey: 'YOUR_KEY' });
const sessionStorage: IStorage = storage({ storageType: EStorageType.SESSION, secretKey: 'YOUR_KEY' });

localStorage.set('keylocal', data);
console.info(localStorage.get('keylocal'));
localStorage.remove('keylocal');

sessionStorage.set('keySession', data);
console.info(sessionStorage.get('keySession'));
sessionStorage.clear();
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
