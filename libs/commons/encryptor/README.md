# Storage Module

El Encryptor module es una implementación para angular de la librería Encryption Manager del proyecto Claro Core.

Se usa el metodo de encriptación Traffic bajo el estándar RSA, para poder enviar datos en transito encriptados.


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
import { EncryptorModule } from '@claro/commons/encryptor';

export const Modules = [];
Modules.push(EncryptorModule.forRoot('YOUR_PUBLIC_PEM_KEY'));
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
import { Encryptor } from '@claro/commons/encryptor';

...
  constructor (
    private encryptor: Encryptor,
    ...
  ) {
    console.log('value:', 'value to encrypt');
    console.log('encrypted value:', this.encryptor.encrypt(value));
  }
````


## Api References

* Métodos

| Nombre | Descripción |
|--------|-------------|
| encrypt() | Permite encriptar un valor para enviarlo via http |

* Providers:

| Nombre | descripción |
| -------| ------------|
| Encryptor | La clase "Encryptor" permite inyectar un objeto Encryptor. |

### Reglas de Configuración

| Atributo | Descripción | Tipo (Valor) |
|----------|-------------|--------------|
| publicKey | Llave pública .pem utilizada en el encriptamiento de datos | STRING (obligatorio) |

Mayor detalle en Claro Core - Encryption Manager

### Caso Práctico

````javascript
...

const public_key = `-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----`;
const myEncryptor = new EncryptionManager(public_key).getEncryptor('traffic');
...
console.log('RSA hash: ', myEncryptor.encrypt('String to be encrypted'));
...
````


## Autores
* **Jefferson Lara** - *Initial work* - [jlaramol@everis.com](jlaramol@everis.com)
* **Juan Mauricio** - *Initial work* - [juan.alejandro.mauricio.aguirre@everis.com](juan.alejandro.mauricio.aguirre@everis.com)
* **José León** - *Initial work* - [jleonram@everis.com](jleonram@everis.com)
* **Ricardo García** - *Initial work* - [rgarrodr@everis.com](rgarrodr@everis.com)

Vea también la lista de [contributors]() que participaron en este proyecto.


## Licencia
Este proyecto es propiedad intelectual de EVERIS. El uso sin autorización está prohibido. Revise el archivo [LICENSE.md]() para mayor detalles.
