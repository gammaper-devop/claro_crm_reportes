Encryption Manager
=======
SDK de encriptación, el cual permite la seguridad(cifrado) en los diferentes gestores de almacenamiento actuales (browser, traffic, etc), utilizando algoritmos basados en los estándares AES (encriptación simétrica) y RSA.

## Ejemplo de Encriptación BD Browser
```javascript
import { EncryptionManager } from '@claro/js-core'

// Obtener el encriptador según el caso de uso:  Browser | Traffic
const public_key = '12346789';
const encryptor = new EncryptionManager(public_key);

// Encriptación
const valor = 'string a ser encriptado';
hash = encryptor.getEncryptor('browser').encrypt(valor);
console.log(hash)  //--> valor encriptado

// Desencriptación
valor = encryptor.getEncryptor('browser').unencrypt(hash);
console.log(valor) //--> valor desencriptado
```
## Ejemplo de Encriptación de Tráfico Http
```javascript
// TODO
```

## Tipos de Encriptación

- Browser: Encriptador ligero orientado a agregar una capa de protección al almacenamiento en el browser, siguiendo el estándar de encriptación AES.
- Traffic: Encriptador orientado a la protección de datos sensibles, transmitidos vía peticiones Http, desde el Frontend por medio de RSA Algorithm.

## Custom Key and IV  - Longitud Key

La longitud de key esta definida por el tipo de encriptación. El Key es de 32 bytes para AES-256 (16 bytes si se desea obtener AES-128). En otro caso, al descifrar, se obtendrá un mensaje vacío.

## Api References

### Providers:

| Nombre | descripción |
| -------| ------------|
| **EncryptionManager** | La clase "EncryptionManager" permite inyectar un objeto Encryptor. |

#### Métodos:

| Nombre | descripción |
| -------| ------------|
| **encrypt** | Permite encriptar un valor |
| **unEncrypt** | Permite desencriptar un valor encriptado |


## Contribución

## Librerías utilizadas para la construcción
- AES [CryptoJs](https://github.com/brix/crypto-js)
- RSA [jsencrypt](https://github.com/travist/jsencrypt)

## Colaboradores
- Jefferson Lara Molina<jlaramol@everis.com>
- Juan Alejandro Mauricio <juan.alejandro.mauricio.aguirre@everis.com>
- José León Ramos <jleonram@everis.com>
- Ricardo García <rgarrodr@everis.com>

## Licencia
Este proyecto es propiedad intelectual de EVERIS. El uso sin autorización está prohibido. Revise el archivo [LICENSE.md]() para mayor detalles.
