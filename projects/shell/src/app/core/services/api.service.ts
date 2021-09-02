import { Injectable } from '@angular/core';

import { CRMApiService } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';

@Injectable()
export class ApiService extends CRMApiService {
  ip = environment.ip;
  generateToken = environment.apiToken + '/auth/token-account';
  refreshToken = environment.apiToken + '/auth/token-refresh';
  removeToken = environment.apiToken + '/auth/token-remove';
  user = environment.api + '/user';
}
