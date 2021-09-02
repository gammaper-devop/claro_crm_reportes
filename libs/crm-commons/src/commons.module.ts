import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CommonsModule } from '@claro/commons';
import { MicroAppLoaderModule } from './microapp-loader';
import { Components } from './components';
import { LoadingInterceptor } from './helpers';
import { MocksInterceptor } from './mocks';

import { Services } from './services';
import { ConfirmService, DialogService, SnackbarService } from './components/molecules';

@NgModule({
  imports: [CommonModule, CommonsModule, MicroAppLoaderModule],
  declarations: Components,
  exports: [CommonModule, CommonsModule, MicroAppLoaderModule, ...Components],
  entryComponents: Components,
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MocksInterceptor, multi: true },
    ConfirmService,
    DialogService,
    SnackbarService,
    ...Services
  ]
})
export class CRMCommonsModule {}
