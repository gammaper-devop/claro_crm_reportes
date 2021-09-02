import { CommonsModule } from '@claro/commons';
import { EventBusModule } from '@claro/commons/event-bus';
import { StorageModule, IStorageConfig } from '@claro/commons/storage';
import { CRMCommonsModule } from '@claro/crm/commons';

const secretKey = '65537';
const storageConfig: IStorageConfig = { secretKey };

export const Modules: any[] = [
  CommonsModule,
  EventBusModule.forRoot(),
  StorageModule.forRoot(storageConfig),
  CRMCommonsModule
];
