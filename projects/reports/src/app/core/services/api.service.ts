import { Injectable } from '@angular/core';

import { CRMApiService } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';

@Injectable()
export class ApiService extends CRMApiService {
    criteria = environment.api + '/busquedas/criterios';
    sellerLists = environment.api + '/vendedores/listas';
    dealers = environment.api + '/distribuidores/listas';
    //portabilityParams = environment.api + '/portabilidades/parametros';

    pending = environment.api + '/pagosclientes/listas';
    paid = environment.api + '/contratos/pagados';
    paymentRollback = environment.api + '/anulaciones/pagos';
    contractRollback = environment.api + '/contratos/anulaciones';
    paymentDetail = environment.api + '/pagosclientes/detalles';
    generateDocuments = environment.api + '/acuerdos/documentos';
    search = environment.api + '/crmclientes/busquedas';
    profile = environment.api + '/profile';
    customerAdd = environment.api + '/crmclientes/registros';
    departments = environment.api + '/ubigeos/departamentos';
    provinces = environment.api + '/ubigeos/provincias';
    districts = environment.api + '/ubigeos/distritos';
    payment = environment.api + '/pagosclientes/listas';
    cancelPayment = environment.api + '/anulaciones/pagos';
    operations = environment.api + '/operaciones/tipos';
    plans = environment.api + '/portabilidades/planes';
    ubigeos = environment.api + '/provinciasydistritos/listas';
    populatedCenters = environment.api + '/ubigeos/centrospoblados';
 
    validateIdentification = environment.api + '/usuarios/vendedores';

    authSupervisor = environment.api + '/usuarios/supervisores';
}
