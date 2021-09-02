import { IStorage, IStorageConfig } from './global';
import { MemoryStorage } from './storages';

export class StorageBuilder {
  constructor(private storage: IStorage, private config: IStorageConfig) {}

  getStorage() {
    try {
      this.storage.set('test', 'test');
      this.storage.get('test');
      this.storage.remove('test');

      return this.storage;
    } catch (e) {
      return new MemoryStorage(this.config);
    }
  }
}
