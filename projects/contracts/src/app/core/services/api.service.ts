import { Injectable } from '@angular/core';

import { CRMApiService } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';

@Injectable()
export class ApiService extends CRMApiService {
    pending = environment.api + '/pagosclientes/listas';
    paid = environment.api + '/contratos/pagados';
    paymentRollback = environment.api + '/anulaciones/pagos';
    contractRollback = environment.api + '/contratos/anulaciones';
    paymentDetail = environment.api + '/pagosclientes/detalles';
    generateDocuments = environment.api + '/acuerdos/documentos';
    search = environment.api + '/crmclientes/busquedas';
}
