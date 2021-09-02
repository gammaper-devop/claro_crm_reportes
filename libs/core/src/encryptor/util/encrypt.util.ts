import * as CryptoJS from 'crypto-js';

export const ENCRYPT_UTIL = {
  /**
   * Utility that encryptSalt
   */
  encryptSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8);
  },
  /**
   * Utility that encryptIv
   */
  encryptIv(value: string) {
    return CryptoJS.enc.Utf8.parse(value);
  },
  /**
   * Utility that encryptAes
   */
  encryptAes(value: string, key: string, iv: string) {
    return CryptoJS.AES.encrypt(value, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  },
};
