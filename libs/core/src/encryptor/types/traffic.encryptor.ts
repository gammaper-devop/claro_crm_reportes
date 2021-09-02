import { JSEncrypt } from 'jsencrypt';

import { IEncryptor } from '../global/interfaces';

export class TrafficEncryptor implements IEncryptor {
  private pubKey: string;
  private encryptor: any;

  constructor(pubKey: string) {
    this.pubKey = pubKey;
    this.encryptor = new JSEncrypt();
  }

  encrypt<T>(value: T | any): string {
    this.encryptor.setPublicKey(this.pubKey);
    return this.encryptor.encrypt(value);
  }

  unEncrypt(value: string) {
    return null;
  }
}
