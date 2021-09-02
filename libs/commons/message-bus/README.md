# Message Bus

El Message Bus es una solución para micro frontends, que tiene como principal objetivo facilitar a los desarrolladores la comunicación entre diferentes aplicaciones, mediante el uso de una interfaz común. Permite emitir y escuchar mensajes a través de diferentes canales y tópicos. Adicionalmente, permite persistir los mensajes almacenándolos en el localStorage de forma segura.


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


# Como Usar

El siguiente ejemplo práctico, muestra cómo realizar la configuración e implementación necesaria para utilizar el Bus de mensajería:

````javascript
...
import { MessageBusService } from '@claro/commons/message-bus';

@Component({
  template: `
    <button (click)="send()">Send</button>
  `
})
export class MockComponent {
  constructor(private messageBus: MessageBusService) { }

  send() {
    this.messageBus.emit<string>('SomeChannel', 'SomeTopic', 'Hello World');
  }
}

@Component({
  template: `
    <h1>{{message}}</h1>
  `
})
export class OtherComponent implements OnInit, OnDestroy {
  message = '';
  private messageBusRef = new Subscription();

  constructor(private messageBus: MessageBusService) { }

  ngOnInit() {
    this.messageBus.on$<string>('SomeChannel', 'SomeTopic').subscribe(message => {
      this.message = message;
    });
  }

  ngOnDestroy() {
    this.messageBusRef.unsubscribe();
  }
}
````

## Api References

* Métodos

| Nombre | Descripción |
|--------|-------------|
| emit<T>() | Enviá/almacena un objeto mensaje en un canal y tópico especifico |
| on$<T>() | Escucha/recibe mensajes de un canal y tópico especifico |
| getValue<T>() | Obtiene el último mensaje de un canal y tópico especifico |
| getValues<T>() | Obtiene todos los mensajes de un canal y tópico especifico |
| getChannels() | Obtiene todos los canales, tópicos y mensajes almacenados |

* Interfaces

| Nombre | Descripción |
|--------|-------------|
| getInstance() | Método estático inicial para obtener una única instancia |
| IChannel | Interfaz que contiene los tópicos |
| ITopic | Interfaz que contiene los mensajes |
| IMessageBus | Interfaz que contiene las definiciones a ser implementadas por la correspondiente clase |
| IMessageBusConfig | Especifica una determinada configuración al emitir un tópico |



## Licencia
Este proyecto es propiedad intelectual de EVERIS. El uso sin autorización está prohibido. Revise el archivo [LICENSE.md]() para mayor detalles.
