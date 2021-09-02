import { MemoryStorageManager } from './memory-storage.manager';

export class MemoryStorage extends MemoryStorageManager {
  memoryStorage = new Map<string, string>();
}
