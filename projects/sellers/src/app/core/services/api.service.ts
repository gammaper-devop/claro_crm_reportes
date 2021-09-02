import { Injectable } from '@angular/core';

import { CRMApiService } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';

@Injectable()
export class ApiService extends CRMApiService {
  searchSellers = environment.api + '/empadronamientos/busquedas';
  networkAccountTypes = environment.api + '/empadronamientos/cuentas';
  portabilityParams = environment.api + '/portabilidades/parametros';
  phoneValidate = environment.api + '/empadronamientos/validaciones';
  registerSellers = environment.api + '/empadronamientos/vendedores';
  documentSearch = environment.api + '/busquedas/criterios';
}
