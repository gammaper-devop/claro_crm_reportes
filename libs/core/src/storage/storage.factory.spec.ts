import { EStorageType, IStorageConfig, StorageFactory as storage } from '.';
import { BrowserStorageManager } from './storages/browser-storage.manager';

let sessionStorage;
let _localStorage;
let memoryStorage;

describe('Storage Factory', () => {
  describe('Cuando se crea un session storage', () => {
    beforeEach(() => {
      let store = {};

      spyOn(window.localStorage, 'getItem').and.callFake(
        (key: string): String => {
          return store[key] || null;
        },
      );

      spyOn(window.localStorage, 'setItem').and.callFake(
        (key: string, value: string): String => {
          store[key] = value;

          return store[key];
        },
      );
      spyOn(window.localStorage, 'clear').and.callFake(() => {
        store = {};
      });
      const config: IStorageConfig = {
        secretKey: String(Math.log(1000)),
        storageType: EStorageType.LOCAL,
      };
      _localStorage = storage(config);
    });

    it('iiiiii', () => {
      expect(_localStorage).toEqual(jasmine.any(BrowserStorageManager));
    });

    it('Deberia ser un browser storage valido', () => {
      expect(_localStorage).toBeDefined();
    });

    it('Deberia estar definido el metodo set', () => {
      expect(_localStorage.set).toBeDefined();
    });

    it('Deberia estar definido el metodo get', () => {
      expect(_localStorage.get).toBeDefined();
    });
  });
});
