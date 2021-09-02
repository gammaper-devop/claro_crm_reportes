import * as browser from '../types/browser.encryptor';
import { DECRYPT_UTIL } from '../util/decrypt.util';

describe('Util-decrypt', () => {

  let encryptorInstance: any;

  beforeEach(() => {
    encryptorInstance = new browser.BrowserEncryptor(jasmine.any.toString());
  });

  describe('Verifying Util-decrypt functions', function() {
    it('verificando que la función decryptSalt() exista', () => {
      let value = encryptorInstance.encrypt('Hola buenos dias', 'Secret Password');
      expect(DECRYPT_UTIL.decryptSalt(value)).toBeDefined();
    });

    it('verificando que la función decryptIv() exista', () => {
      let value = encryptorInstance.encrypt('Hola buenos dias', 'Secret Password');
      expect(DECRYPT_UTIL.decryptIv(value)).toBeDefined();
    });

    it('verificando que la función decryptMessage() exista', () => {
      let value = encryptorInstance.encrypt('Hola buenos dias', 'Secret Password');
      expect(DECRYPT_UTIL.decryptMessage(value)).toBeDefined();
    });

    it('verificando que la función decryptAes() exista', () => {
      let value = encryptorInstance.encrypt('Hola buenos dias', 'Secret Password');
      expect(DECRYPT_UTIL.decryptAes('', '', '')).toBeDefined();
    });
  });

});
