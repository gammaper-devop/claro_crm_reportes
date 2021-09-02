import { IEncryptor, TypeEncryptor } from './global/interfaces';
import { encryptors } from './types';

export class EncryptionManager {
  private pubKey: string;

  constructor(key: string) {
    this.pubKey = key;
  }

  getEncryptor(type: TypeEncryptor): IEncryptor {
    if (encryptors.hasOwnProperty(type)) {
      return new encryptors[type](this.pubKey);
    } else {
      throw new Error(`El encriptado ${type}, no existe.`);
    }
  }
}

export { IEncryptor, TypeEncryptor } from './global/interfaces';
export { BrowserEncryptor, TrafficEncryptor } from './types';
