# Storage Module

El Storage module es una implementación para angular de la librería Storage Manager del proyecto Claro Core.

Actualmente contamos con las siguientes opciones de almacenamiento:

1. Browser Storage
> * Local Storage
> * Session Storage

2. Memory Storage


## Pre-requisitos
Para poder utilizar o extender la librería es necesario tener instaladas las siguientes herramientas:
* Node 10+
* Angular 6+


## Dependencias
Este proyecto tiene una dependencia directa con Claro Core


## Instalación
```bash
$ cd path-to-project;
$ npm install @claro/commons;
```


## Como Usar

* Configurar el Storage Module (app.config.ts)

````javascript
import { StorageModule, IStorageConfig } from '@claro/commons/storage';

const storageConfig: IStorageConfig = {
  secretKey: 'YOUR_KEY',
}

export const Modules = [];
Modules.push(StorageModule.forRoot(storageConfig));
````

* Importar en el App Module (app.module.ts)

````javascript
import { Modules } from './app.config';

@NgModule({
  ...
  imports: [
    ...Modules,
  ],
  ...
})
export class AppModule { }
````

* Usarlo inyectando el determinado servicio en el constructor de su componente

````javascript
import { LocalStorage, SessionStorage } from '@claro/commons/storage';

...
  constructor (
    private localStorage: LocalStorage,
    private sessionStorage: SessionStorage,
    ...
  ) {
    this.localStorage.set('key', 'value');
    this.sessionStorage.set('key', 'value');
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

### Reglas de Configuración

| Atributo | Descripción | Tipo (Valor) |
|----------|-------------|--------------|
| secretKey | Llave secreta utilizada en el encriptamiento de datos al almacenarlos | STRING (obligatorio) |
| storageType | Tipo de almacenamiento a utilizar proveniente del Storage Module | ENUM EStorageType (LocalStorage) |
| i18nLang | Idioma a utilizar en los mensajes de respuesta | STRING (es) |

Mayor detalle en Claro Core - Storage Manager

### Caso Práctico

````javascript
...
const storageConfig: IStorageConfig = {
  i18nLang: 'en_US',
  secretKey: String(Math.log(1000)),
}
...
console.log(1, this.localStorage.get('user'));

this.localStorage.set('user', { user: 'ECNF' });
console.log(2, this.localStorage.get('user'));

this.localStorage.remove('user');
console.log(3, this.localStorage.get('user'));

this.localStorage.set('user', { user: 'ECNF' });
console.log(4, this.localStorage.get('user'));

this.localStorage.clear();
console.log(5, this.localStorage.get('user'));
...
````


## Autores

* **Jefferson Lara** - *Initial work* - [jlaramol@everis.com](jlaramol@everis.com)
* **Ricardo García** - *Initial work* - [rgarrodr@everis.com](rgarrodr@everis.com)

Vea también la lista de [contributors]() que participaron en este proyecto.


## Licencia
Este proyecto es propiedad intelectual de EVERIS. El uso sin autorización está prohibido. Revise el archivo [LICENSE.md]() para mayor detalles.
