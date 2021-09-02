import * as encryptionConstants from '../global/constants';
import { ENCRYPT_UTIL } from '../util/encrypt.util';

describe('util-encrypt', function() {
  it('verificando que la función encryptSalt() exista', () => {
    expect(ENCRYPT_UTIL.encryptSalt()).toBeDefined();
  });

  it('verificando que la función encryptIv() exista', () => {
    let iv = encryptionConstants.hash;
    expect(iv).toBe(encryptionConstants.hash);
    expect(ENCRYPT_UTIL.encryptIv(iv)).toBeDefined();
  });

  it('verificando que la función encryptAes() exista', () => {
    const value = '';
    const key = '';
    const iv = '';

    expect(ENCRYPT_UTIL.encryptAes(value, key, iv)).toBeDefined();
  });
});
