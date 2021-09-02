import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';

import { MicroAppConfigService } from '@claro/crm/commons';
import { AppSecurity } from './app.security';

registerLocaleData(localeEs);

export function microappConfigInit(
  service: MicroAppConfigService,
  appSecurity: AppSecurity,
) {
  return async () => {
    const config = await service.load();
    if (config.consoleSecurity) {
      appSecurity.consoleSecurity();
    }
    return true;
  };
}

export const Providers = [
  AppSecurity,
  { provide: LOCALE_ID, useValue: 'es' },
  {
    provide: APP_INITIALIZER,
    useFactory: microappConfigInit,
    multi: true,
    deps: [MicroAppConfigService, AppSecurity],
  },
];
