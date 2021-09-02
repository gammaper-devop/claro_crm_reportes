# Claro Styles

Proyecto que contiene los estilos de Claro reutilizables para sus diferentes aplicaciones web

## Project Architecture

El proyecto sigue la metodología [ITCSS](https://www.arsys.es/blog/programacion/itcss-mejores-practicas-css/) que indica se debe seguir una estructura de directorios basada en una pirámide invertida.

1. Settings: Declararemos las variables y los preprocesadores, y las situaremos en esta carpeta.
2. Tools: Los mixins y funciones, junto con los preprocesadores, irán en esta carpeta.
3. Generics: El código genérico del proyecto, el reset de CSS, el Normalize o tus propios estilos, son los que incluiremos en esta carpeta.
4. Elements: Para  los estilos que afectan a los elementos del HTML. No incluiremos el estilo para las clases.
5. Objects: Aquí sí, incorporaríamos las clases y colocaríamos todo lo relacionado con el layout.
6. Components: Todo lo que afecte a los diferentes bloques de nuestro documento, navegador, botones, recuadros de utilidades, migas de pan, cabecera, buscador, botones sociales, etc., debería de ir en esta carpeta. Dependiendo de las necesidades que tenga el proyecto, la carpeta Components tendrá más o menos ajustes, como es lógico
7. Utilities: Para finalizar, en esta carpeta colocaríamos utilidades que sobrescriban estilos significativos (incompatibilidades con navegadores, por ejemplo).

## Build

Run `ng build styles` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

npm publish

## Running unit tests

Run `ng test styles` to execute the unit tests via [Karma](https://karma-runner.github.io).
