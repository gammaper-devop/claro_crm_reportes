import { Injectable } from '@angular/core';

import { CRMApiService } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';

@Injectable()
export class ApiService extends CRMApiService {
    getUserDocuments = environment.api + '/busquedas/criterios';
    sellerLists = environment.api + '/vendedores/listas';
    portabilityParams = environment.api + '/portabilidades/parametros';

    pending = environment.api + '/pagosclientes/listas';
    paid = environment.api + '/contratos/pagados';
    paymentRollback = environment.api + '/anulaciones/pagos';
    contractRollback = environment.api + '/contratos/anulaciones';
    paymentDetail = environment.api + '/pagosclientes/detalles';
    generateDocuments = environment.api + '/acuerdos/documentos';
    search = environment.api + '/crmclientes/busquedas';
    criteria = environment.api + '/busquedas/criterios';
    profile = environment.api + '/profile';
    customerAdd = environment.api + '/crmclientes/registros';
    departments = environment.api + '/ubigeos/departamentos';
    provinces = environment.api + '/ubigeos/provincias';
    districts = environment.api + '/ubigeos/distritos';
    payment = environment.api + '/pagosclientes/listas';
    cancelPayment = environment.api + '/anulaciones/pagos';
    operations = environment.api + '/operaciones/tipos';
    maxlines = environment.api + '/portabilidades/cantidades';
    portabilityValidate = environment.api + '/portabilidades/lineas';
    registerConsult = environment.api + '/portabilidades/registrosconsultas';
    previewConsult = environment.api + '/portabilidades/consultas';
    newLineOptions = environment.api + '/portabilidades/opciones';
    documentDeclare = environment.api + '/declaraciones/portabilidades';
    generateSec = environment.api + '/portabilidades/generaciones';
    officeDetails = environment.api + '/portabilidades/oficinas';
    modalities = environment.api + '/modalidades/destinos';
    validateDisponibility = environment.api + '/portabilidades/disponibilidades';
    validateDisponibilityRepo = environment.api + '/renovaciones/disponibilidades';
    campaigns = environment.api + '/portabilidades/campanas';
    prices = environment.api + '/portabilidades/precios';
    plans = environment.api + '/portabilidades/planes';
    ubigeos = environment.api + '/provinciasydistritos/listas';
    populatedCenters = environment.api + '/ubigeos/centrospoblados';
    promotions = environment.api + '/altas/promociones';
    addItem = environment.api + '/portabilidades/registros';
    documentsSign = environment.api + '/portabilidades/trade-agreements';
    saveSales = environment.api + '/ventas/datos';
    saveSalesRenoRepo = environment.api + '/renovaciones/datos';
    documentPayments = environment.api + '/pagos/documentos';
    executePaymentPorta = environment.api + '/pagos/ejecucciones';
    executePaymentAlta = environment.api + '/altas/transacciones';
    executePayment = environment.api + '/renovaciones/pagos';
    portabilityRequest = environment.api + '/solicitudes/portabilidades';
    validateIdentification = environment.api + '/usuarios/vendedores';
    searchlines = environment.api + '/renovaciones/validaciones';
    multipointQuery = environment.api + '/multipuntos/consultas';
    sellerQuery = environment.api + '/multipuntos/vendedores';
    customersReasons = environment.api + '/renovaciones/motivosclientes';
    tgfiReasons = environment.api + '/renovaciones/motivostgfi';
    authSupervisor = environment.api + '/usuarios/supervisores';
    materialDescriptions = environment.api + '/renovaciones/materiales';
    series = environment.api + '/renovaciones/series';
    seriesPorta = environment.api + '/portabilidades/series';
    points = environment.api + '/claroclubs/consultas';
    omissionPin = environment.api + '/portabilidades/omisiones';
    addressIdentifier = environment.api + '/renovaciones/direccionesprefijos';
    addressType = environment.api + '/renovaciones/consultastablas';
    suggestedDates = environment.api + '/renovaciones/fechassugeridas';
    availableDates = environment.api + '/renovaciones/fechasdisponibles';
    providers = environment.api + '/renovaciones/proveedores';
    paymentTypes = environment.api + '/renovaciones/tipospagos';
    dispatchOptions = environment.api + '/portabilidades/entregatipos';
    stockValidation = environment.api + '/portabilidades/stocks';
}
