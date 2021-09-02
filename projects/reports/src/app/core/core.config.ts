import { CommonsModule } from '@claro/commons';
import { CRMCommonsModule } from '@claro/crm/commons';
import { CoreModule as ShellCoreModule } from '@shell/app/core';

export const Modules: any[] = [
  CommonsModule,
  CRMCommonsModule,
  ShellCoreModule
];
