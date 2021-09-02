# Store

El Store es una solución para aplicaciones web, que tiene como principal objetivo facilitar a los desarrolladores el manejo de estados, mediante el uso de una interfaz común.

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
import { Store } from '@claro/js-core';

class UserService extends Store<User> {
  create(user: User) {
    this.setState(user);
  }

  update(user: User) {
    const newState = { ...this.getValue(), ...{ user } };
    this.setState(newState);
  }
}
````

## Api References

* Métodos

| Nombre | Descripción |
|--------|-------------|
| setState() | Asigna un nuevo estado al modelo |
| getState() | Obtiene un observable con el estado actual del modelo  |
| getValue() | Obtiene el valor del estado actual del modelo |

* Interfaces

| Nombre | Descripción |
|--------|-------------|
| getInstance() | Método estático inicial para obtener una única instancia |
| IStore | Interfaz que contiene las definiciones a ser implementadas por el correspondiente servicio |


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
