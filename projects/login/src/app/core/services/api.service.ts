import { Injectable } from '@angular/core';

import { CRMApiService } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';

@Injectable()
export class ApiService extends CRMApiService {
  validateIdentification = environment.api + '/asesores/documentos';
}
