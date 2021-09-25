import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { LoadingInterceptor } from '@claro/crm/commons';
import { Modules } from './core.config';
import { Guards } from './guards';
import { MocksInterceptor } from './mocks';
import { Services } from './services';

@NgModule({
  imports: [CommonModule, ...Modules],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MocksInterceptor, multi: true },
    ...Services,
    ...Guards,
  ],
  exports: [CommonModule, ...Modules],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule {}
