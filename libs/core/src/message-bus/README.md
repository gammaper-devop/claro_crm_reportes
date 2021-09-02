# Message Bus

El Message Bus es una solución para micro frontends, que tiene como principal objetivo facilitar a los desarrolladores la comunicación entre diferentes aplicaciones, mediante el uso de una interfaz común. Permite emitir y escuchar mensajes a través de diferentes canales y tópicos. Adicionalmente, permite persistir los mensajes almacenándolos en el localStorage de forma segura.

![logo](\src\docs\architecture.png)


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

El siguiente ejemplo práctico, muestra cómo realizar la configuración e implementación necesaria para utilizar el Bus de mensajería:

````javascript
import { IMessageBus, MessageBus } from '@claro/js-core';

class FrontendClass {
  _messageBus: IMessageBus;

  constructor() {
    this._messageBus = MessageBus.getInstance();
  }

  handleClick() {
    this._messageBus.emit('frontend', 'tips', 'Hello World');
  }

  showTips() {
    this._messageBus.on$('frontend', 'tips').subscribe((tip: string) => {
      console.log(tip);
    });
  }
}
````

## Api References

* Métodos

| Nombre | Descripción |
|--------|-------------|
| emit() | Enviá/almacena un objeto mensaje en un canal y tópico especifico |
| on$() | Escucha/recibe mensajes de un canal y tópico especifico |
| getValue() | Obtiene el último mensaje de un canal y tópico especifico |
| getValues() | Obtiene todos los mensajes de un canal y tópico especifico |
| getChannels() | Obtiene todos los canales, tópicos y mensajes almacenados |

* Interfaces

| Nombre | Descripción |
|--------|-------------|
| getInstance() | Método estático inicial para obtener una única instancia |
| IChannel | Interfaz que contiene los tópicos |
| ITopic | Interfaz que contiene los mensajes |
| IMessageBus | Interfaz que contiene las definiciones a ser implementadas por la correspondiente clase |
| IMessageBusConfig | Especifica una determinada configuración al emitir un tópico |


### Caso Práctico

````javascript
import { MessageBus } from '@claro/js-core';

const messageBus = MessageBus.getInstance();

messageBus.emit('frontend', 'tips', 'a');
messageBus.emit('frontend', 'tips', 'b');
messageBus.emit('frontend', 'tips', 'c');

messageBus.on$('frontend', 'tips').subscribe((data: any) => {
  console.log('subscription 1:', data);
});

messageBus.emit('frontend', 'tips', 'd', { persist: true });

const messageBus2 = MessageBus.getInstance();

messageBus2.on$('frontend', 'tips').subscribe((data: any) => {
  console.log('subscription 2:', data);
});

messageBus2.emit('frontend', 'tips', 'e');

console.log('all tips:', messageBus.getValues('frontend', 'tips'));

console.log('last tip:', messageBus.getValue('frontend', 'tips'));
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

* **Ricardo García** - *Initial work* - [rgarrodr@everis.com](rgarrodr@everis.com)

Vea también la lista de [contributors]() que participaron en este proyecto.


## Licencia
Este proyecto es propiedad intelectual de EVERIS. El uso sin autorización está prohibido. Revise el archivo [LICENSE.md]() para mayor detalles.
