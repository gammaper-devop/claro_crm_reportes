import { EStorageType } from './enums';

export interface IStorageConfig {
  secretKey: string;
  storageType?: EStorageType;
  i18nLang?: string;
}

export interface IMessages {
  invalid_storage_type: string;
  key_not_found: string;
  secret_key_not_found: string;
}

export interface IStorage {
  set(key: string, value: any): void;
  get(key: string): any;
  remove(key: string): void;
  clear(): void;
}
