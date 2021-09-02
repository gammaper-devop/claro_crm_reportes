import * as CryptoJS from 'crypto-js';

import * as EncryptionConstants from '../global/constants';
import { IEncryptor } from '../global/interfaces';

import { DECRYPT_UTIL } from '../util/decrypt.util';
import { ENCRYPT_UTIL } from '../util/encrypt.util';

export class BrowserEncryptor implements IEncryptor {
  private pubKey: string;

  constructor(pubKey: string) {
    this.pubKey = pubKey;
  }

  encrypt<T>(value: T | any): string {
    const salt = ENCRYPT_UTIL.encryptSalt();
    const iv = ENCRYPT_UTIL.encryptIv(EncryptionConstants.hash.toString());
    const key = this.getKey(this.pubKey, salt);
    const aes = ENCRYPT_UTIL.encryptAes(value.toString(), key.toString(), iv);
    const transitmessage = salt.toString() + aes.toString();

    return transitmessage;
  }

  unEncrypt(value: string) {
    const salt = DECRYPT_UTIL.decryptSalt(value.toString());
    const iv = DECRYPT_UTIL.decryptIv(EncryptionConstants.hash.toString());
    const key = this.getKey(this.pubKey, salt);
    const encrypted = DECRYPT_UTIL.decryptMessage(value.toString());
    const aes = DECRYPT_UTIL.decryptAes(encrypted, key.toString(), iv);

    return aes.toString(CryptoJS.enc.Utf8);
  }

  protected getKey = (key: string, salt: any) => {
    return CryptoJS.PBKDF2(key, salt, {
      keySize: EncryptionConstants.keySize / 32,
      iterations: EncryptionConstants.iterationNumber,
    });
  };
}
