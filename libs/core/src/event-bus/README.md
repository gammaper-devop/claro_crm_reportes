# Event Bus

El Event Bus es una solución para micro frontends, que tiene como principal objetivo facilitar a los desarrolladores la comunicación entre diferentes aplicaciones, mediante el uso de una interfaz común. Permite emitir y escuchar eventos.

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

El siguiente ejemplo práctico, muestra cómo realizar la configuración e implementación necesaria para utilizar el Bus de eventos:

````javascript
import { EventBus, IEventBus } from '@claro/js-core';

class FrontendClass {
  _eventBus: IEventBus;

  constructor() {
    this._eventBus = EventBus.getInstance();
    this._eventBus.$on('openModal', (data: string) => {
      console.log(data);
    });
  }

  handleClick() {
    this._eventBus.$emit('openModal', {});
  }
}
````

## Api References

* Métodos

| Nombre | Descripción |
|--------|-------------|
| $emit() | Dispara un evento, enviando opcionalmente datos  |
| $on() | Escucha un evento, ejecutando una función callback |

* Interfaces

| Nombre | Descripción |
|--------|-------------|
| getInstance() | Método estático inicial para obtener una única instancia |
| IEventBus | Interfaz que contiene las definiciones a ser implementadas por la correspondiente clase |


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
