import { CommonsModule } from '@claro/commons';
import { EncryptorModule } from '@claro/commons/encryptor';
import { CRMCommonsModule } from '@claro/crm/commons';
import { CoreModule as ShellCoreModule } from '@shell/app/core';
import { publicKey } from '@login/app/core/public-key.pem';

export const Modules: any[] = [
  CommonsModule,
  EncryptorModule.forRoot(publicKey),
  CRMCommonsModule,
  ShellCoreModule,
];
