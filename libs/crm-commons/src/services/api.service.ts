import { Injectable } from '@angular/core';

import { ClaroApiService } from '@claro/commons';
import { environment } from '../environments/environment';

@Injectable()
export class CRMApiService extends ClaroApiService {
  getUserDocuments = environment.api + '/documentos/listas';
  getBestFingerprint = environment.api + '/huellas/obtenciones';
  validateFingerprint = environment.api + '/clientes/huellas';
  validateSecurityQuestions = environment.api + '/nobiometriasvalidaciones/respuestas';
  passBiometric = environment.api + '/nobiometriasvalidaciones/biometrias';
  getSecurityQuestions = environment.api + '/nobiometriasvalidaciones/preguntas';
  sendPin = environment.api + '/pines/generaciones';
  validatePin = environment.api + '/pines/validaciones';
  generics = environment.api + '/datosgenericos/combos';
  biometricStatus = environment.api + '/portability/biometric-consult';

  officeDetails = environment.api + '/portabilidades/oficinas';
  registerConsult = environment.api + '/portabilidades/registrosconsultas';
  previewConsult = environment.api + '/portabilidades/consultas';
  portabilityRequest = environment.api + '/solicitudes/portabilidades';
  getLinceseBiometric = environment.api + '/huellas/licencias';
}
