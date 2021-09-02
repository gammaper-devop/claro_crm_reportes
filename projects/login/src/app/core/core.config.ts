import { CommonsModule } from '@claro/commons';
import { EncryptorModule } from '@claro/commons/encryptor';
import { EventBusModule } from '@claro/commons/event-bus';
import { CRMCommonsModule } from '@claro/crm/commons';
import { CoreModule as ShellCoreModule } from '@shell/app/core';
import { publicKey } from './public-key.pem';

export const Modules: any[] = [
  CommonsModule,
  EncryptorModule.forRoot(publicKey),
  EventBusModule.forRoot(),
  CRMCommonsModule,
  ShellCoreModule
];
