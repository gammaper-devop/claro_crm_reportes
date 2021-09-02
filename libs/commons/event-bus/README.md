# EventBus Module

El EventBus module es una implementación para angular de la librería EventBus Manager del proyecto Claro Core.


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

* Configurar el EventBus Module (app.config.ts)

````javascript
import { EventBusModule } from '@claro/commons/event-bus';

export const Modules = [];
Modules.push(EventBusModule.forRoot());
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
import { EventBus } from '@claro/commons/event-bus';

...
  constructor (
    private eventBus: EventBus,
    ...
  ) {
    this.eventBus.$on('openModal', (data: string) => {
      console.log(data);
    });
  }

  handleClick() {
    this.eventBus.$emit('openModal', {});
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

Mayor detalle en Claro Core - EventBus Manager


## Autores
* **Ricardo García** - *Initial work* - [rgarrodr@everis.com](rgarrodr@everis.com)

Vea también la lista de [contributors]() que participaron en este proyecto.


## Licencia
Este proyecto es propiedad intelectual de EVERIS. El uso sin autorización está prohibido. Revise el archivo [LICENSE.md]() para mayor detalles.
