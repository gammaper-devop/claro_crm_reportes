import {
  CONSTANTS,
  EStorageType,
  IMessages,
  IStorage,
  IStorageConfig,
} from './global';
import * as messagesList from './global/i18n';
import { StorageBuilder } from './storage.builder';
import { LocalStorage, MemoryStorage, SessionStorage } from './storages';

export function StorageFactory(config: IStorageConfig): IStorage {
  let storageInstance;
  config.i18nLang = config.i18nLang || CONSTANTS.i18nLang;
  config.storageType = config.storageType || EStorageType.LOCAL;
  let messages: IMessages;
  switch (config.i18nLang) {
    case 'en_US':
      messages = messagesList.EN;
      break;
    default:
      messages = messagesList.ES;
      break;
  }
  if (!config.secretKey) {
    throw new TypeError(messages.secret_key_not_found);
  }
  try {
    switch (config.storageType) {
      case 'local':
        storageInstance = new LocalStorage(config);

        return new StorageBuilder(storageInstance, config).getStorage();
      case 'session':
        storageInstance = new SessionStorage(config);

        return new StorageBuilder(storageInstance, config).getStorage();
      case 'memory':
        return new MemoryStorage(config);
      default:
        return invalidStorage(messages.invalid_storage_type);
    }
  } catch (e) {
    return new MemoryStorage(config);
  }
}

function invalidStorage(message: string): never {
  throw new TypeError(message);
}
