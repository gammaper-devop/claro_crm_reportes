import { BrowserEncryptor } from '../types/browser.encryptor';

describe('browser', () => {
  const pubKey = jasmine.any.toString();
  let browser = new BrowserEncryptor(pubKey);

  describe('Encriptación global', () => {
    it('.....', () => {
      expect(browser.encrypt('')).toBeDefined();
    });
  });

  describe('Desencriptación global', () => {
    it('.....', () => {
      expect(browser.unEncrypt('')).toBeDefined();
    });
  });
});
