import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { CRMApiService } from '../services/api.service';
import { environment } from '../environments/environment';
import { MicroApp } from './microapp.interface';

@Injectable({
  providedIn: 'root',
})
export class MicroAppConfigService {
  cdn: string;
  microApps: MicroApp[];
  headers: {};
  biometric: {
    api: string;
    mock: boolean;
  };
  stateAuth: string;
  stateGenerics: string;
  stateIP: string;
  tracing: {
    technical: boolean;
    functional: boolean;
  };
  consoleSecurity: boolean;

  public constructor(private apiService: CRMApiService) {
    this.stateAuth = 'claro-auth';
    this.stateGenerics = 'claro-generics';
    this.stateIP = 'claro-ip';
  }

  async load(): Promise<MicroAppConfigService> {
    return this.apiService
      .get(environment.cdn + '/config/microapp.json')
      .pipe(
        tap(config => {
          this.checkState(config);
          Object.assign(this, config);
          return config;
        }),
      )
      .toPromise();
  }

  private checkState(config) {
    if (this.stateAuth === config.stateAuth) {
      return;
    }
    if (localStorage.getItem(this.stateAuth)) {
      localStorage.setItem(
        config.stateAuth,
        localStorage.getItem(this.stateAuth),
      );
      localStorage.removeItem(this.stateAuth);
    }
  }
}
