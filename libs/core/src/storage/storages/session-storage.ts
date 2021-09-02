import { IStorageConfig } from '../global';
import { BrowserStorageManager } from './browser-storage.manager';

export class SessionStorage extends BrowserStorageManager {
  windowStorage: Storage;

  constructor(config: IStorageConfig) {
    super(config);
    try {
      this.windowStorage = window.sessionStorage;
    } catch (e) {
      this.windowStorage = require('sessionstorage');
    }
  }
}
