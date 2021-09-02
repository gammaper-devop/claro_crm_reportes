import * as CryptoJS from 'crypto-js';

export const DECRYPT_UTIL = {
  /**
   * Utility that decryptSalt
   */
  decryptSalt(value: string) {
    return CryptoJS.enc.Hex.parse(value.substr(0, 32));
  },
  /**
   * Utility that decryptIv
   */
  decryptIv(value: string) {
    return CryptoJS.enc.Hex.parse(value.substr(32, 32));
  },
  /**
   * Utility that decryptMessage
   */
  decryptMessage(value: string) {
    return value.substring(32);
  },
  /**
   * Utility that decryptAes
   */
  decryptAes(value: string, key: string, iv: string) {
    return CryptoJS.AES.decrypt(value, key, {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
  },
};
