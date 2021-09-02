import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';

import { EStorageType, IStorage, IStorageConfig, storage } from '@claro/core';

export { IStorage, IStorageConfig } from '@claro/core';

const StorageConfig = new InjectionToken<IStorageConfig>('storageConfig');

import { LocalStorage, MemoryStorage, SessionStorage } from './services';
export * from './services';

export function _localStorage(config: IStorageConfig): IStorage {
  config.storageType = EStorageType.LOCAL;
  return storage(config);
}

export function _sessionStorage(config: IStorageConfig): IStorage {
  config.storageType = EStorageType.SESSION;
  return storage(config);
}

export function _memoryStorage(config: IStorageConfig): IStorage {
  config.storageType = EStorageType.MEMORY;
  return storage(config);
}

@NgModule()
export class StorageModule {
  static forRoot(storageConfig: IStorageConfig): ModuleWithProviders {
    return {
      ngModule: StorageModule,
      providers: [
        {
          provide: StorageConfig,
          useValue: storageConfig
        },
        {
          provide: LocalStorage,
          useFactory: _localStorage,
          deps: [StorageConfig]
        },
        {
          provide: SessionStorage,
          useFactory: _sessionStorage,
          deps: [StorageConfig]
        },
        {
          provide: MemoryStorage,
          useFactory: _memoryStorage,
          deps: [StorageConfig]
        }
      ]
    };
  }
}
