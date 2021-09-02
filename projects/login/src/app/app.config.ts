import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';

import { MicroAppConfigService } from '@claro/crm/commons';

registerLocaleData(localeEs);

export function microappConfigInit(service: MicroAppConfigService) {
  return () => service.load();
}

export const Providers = [
  { provide: LOCALE_ID, useValue: 'es' },
  {
    provide: APP_INITIALIZER,
    useFactory: microappConfigInit,
    multi: true,
    deps: [MicroAppConfigService]
  }
];
