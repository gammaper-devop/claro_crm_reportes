import { IStorageConfig } from '../global';
import { BrowserStorageManager } from './browser-storage.manager';

export class LocalStorage extends BrowserStorageManager {
  windowStorage: Storage;

  constructor(config: IStorageConfig) {
    super(config);
    try {
      this.windowStorage = window.localStorage;
    } catch (e) {
      this.windowStorage = require('localStorage');
    }
  }
}
