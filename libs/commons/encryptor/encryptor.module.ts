import {
  Injectable,
  InjectionToken,
  ModuleWithProviders,
  NgModule
} from '@angular/core';

import { TrafficEncryptor, EncryptionManager, IEncryptor } from '@claro/core';

const EncryptorKey = new InjectionToken<string>('key');

@Injectable()
export class Encryptor extends TrafficEncryptor {}

export function encryptor(key: string): IEncryptor {
  return new EncryptionManager(key).getEncryptor('traffic');
}

@NgModule()
export class EncryptorModule {
  static forRoot(key: string): ModuleWithProviders {
    return {
      ngModule: EncryptorModule,
      providers: [
        {
          provide: EncryptorKey,
          useValue: key
        },
        {
          provide: Encryptor,
          useFactory: encryptor,
          deps: [EncryptorKey]
        }
      ]
    };
  }
}
