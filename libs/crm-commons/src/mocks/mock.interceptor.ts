import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { UTILS } from '@claro/commons';
import { ErrorResponse } from '@claro/crm/commons';
import { environment } from '../environments/environment';
import { EErrorType } from '../enums';
import { ErrorCodes } from '../global';
import { GenericsResponse, PinResponse } from '../models';
import { CRMApiService } from '../services';

@Injectable()
export class MocksInterceptor implements HttpInterceptor {
  constructor(private apiService: CRMApiService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return of(null)
      .pipe(
        mergeMap(() => {
          if (!environment.mock) {
            return next.handle(request);
          }

          const body =
            typeof request.body === 'string'
              ? JSON.parse(request.body)
              : request.body;
          const params = request.params;
          const isServerOk = Math.random() > 0;
          console.log('request', request.method, request.urlWithParams, body);

          if (
            request.url.match(this.apiService.getUserDocuments) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            let documents = require('./json/user-documents.json');

            if (params.get('pageCode') === 'PAG_CLI') {
              documents = require('./json/customer-documents.json');
            }

            return this.response({ documents });
          }

          if (
            request.url.match(this.apiService.getSecurityQuestions) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const questions = require('./json/user-questions.json');

            return this.response( questions );
          }

          if (
            request.url.match(this.apiService.passBiometric) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const res = require('./json/pass-biometric.json');

            return this.response( res );
          }

          if (
            request.url.match(this.apiService.getBestFingerprint) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (!body.officeSaleCode) {
              const fingerprints = require('./json/fingerprints.json');
              const bestFingerprintRight =
                fingerprints[UTILS.randomNumber(0, 4)];
              const bestFingerprintLeft =
                fingerprints[UTILS.randomNumber(5, 9)];
              return this.response({
                bestFootPrint: {
                  idFootPrintLeft: bestFingerprintLeft.value,
                  footPrintDescriptionLeft: bestFingerprintLeft.label,
                  idFootPrintRight: bestFingerprintRight.value,
                  footPrintDescriptionRight: bestFingerprintRight.label,
                  idBioParent: 'idBioParent',
                },
              });
            } else {
              return this.response({
                configuration: require('./json/biometric-configurations.json'),
              });
            }
          }

          if (
            request.url.match(this.apiService.getLinceseBiometric) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (!body.LinceseBiometric) {
              const biometricLicense = require('./json/biometric-license.json');
              return this.response( biometricLicense );
            } else {
              return this.responseError(
                'El huellero se encuentra sin licencia.',
              );
            }
          }

          if (
            request.url.match(this.apiService.validateFingerprint) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const validFingerprint = Math.random() > 0.2;
            if (validFingerprint) {
              if (body.validationType !== 'V') {
                return this.response({
                  name: 'José',
                  firstName: 'Gonzáles',
                  secondName: 'Guerrero',
                  birthDate: '13/12/1988',
                  expiryDate: '01/02/2020',
                });
              } else {
                return this.response({
                  names: 'José',
                  lastName: 'Gonzáles',
                  motherLastName: 'Guerrero',
                  documentType: '01',
                  documentTypeDescription: 'DNI',
                  documentNumber: '46464646'
                });
              }
            } else {
              return this.responseError(
                'La huella no coincide con la ingresada.',
              );
            }
          }

          if (
            request.url.match(this.apiService.validateSecurityQuestions) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const validateSecurityQuestions = Math.random() > 0.2;
            if (validateSecurityQuestions) {
              if (body.validationType !== 'V') {
                return this.response({
                  name: 'José',
                  firstName: 'Gonzáles',
                  secondName: 'Guerrero',
                  birthDate: '13/12/1988',
                  expiryDate: '01/02/2020',
                });
              } else {
                return this.response({
                  names: 'José',
                  lastName: 'Gonzáles',
                  motherLastName: 'Guerrero',
                  documentType: '01',
                  documentTypeDescription: 'DNI',
                  documentNumber: '46464646'
                });
              }
            } else {
              return this.responseError(
                'Respuestas incorrectas'
              );
            }
          }

          if (
            request.url.match(this.apiService.sendPin) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (Math.random() > 0.4) {
              const pin: PinResponse = {
                sendSMSPin: '12345',
                numberAttempts: 3,
                retriesNumber: 2,
                timerModalWindow: 10,
                numberDigits: 5,
              };
              return this.response(pin);
            } else {
              return this.responseError(ErrorCodes['CRM-910'], 'IDFF1');
            }
          }

          if (
            request.url.match(this.apiService.validatePin) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (Math.random() > 0.4) {
              return this.response({ success: true });
            } else {
              if (Math.random() > 0.3) {
                return this.responseError(
                  'El pin no coincide con el enviado.',
                  'IDFF4',
                );
              } else if (Math.random() > 0.3) {
                return this.responseError(ErrorCodes['CRM-913'], 'IDFF1');
              } else {
                return this.responseError('Ha ocurrido un error.');
              }
            }
          }

          if (
            request.url.match(this.apiService.generics) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            let generics: GenericsResponse[] = require('./json/generics.json');
            const urlParts = request.url.split('/');
            const cboKey = urlParts[urlParts.length - 1];
            if (String(cboKey) !== 'CBO_ALL' && String(cboKey) !== 'CBO_DELIVERY') {
              generics = generics.filter(
                generic => generic.keyCombo === String(cboKey),
              );
            }
            return this.response(generics);
          }

          if (
            request.url.match(this.apiService.officeDetails) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }


            const officeCode = params.get('officeCode');
            const offices = require('./json/offices.json');
            const officeFound = offices.find(element =>
              element.officeSalecode === officeCode
            );

            return this.response(officeFound);
          }

          if (
            request.url.match(this.apiService.biometricStatus) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const validPin = Math.random() > 0.2;
            if (validPin) {
              return this.response({ success: true });
            } else {
              return this.response({ success: false });
            }
          }

          // end!
          return next.handle(request);
        }),
      )
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }

  response(data: any): Observable<HttpResponse<any>> {
    console.log('response', data);
    return of(new HttpResponse({ status: 200, body: data }));
  }

  responseError(
    message: string,
    code = 'CMR-001',
  ): Observable<HttpResponse<ErrorResponse>> {
    const error: ErrorResponse = {
      code: code,
      description: message,
      errorType: EErrorType.Functional,
    };
    console.error(error);
    return throwError(error);
  }

  serverDown(): Observable<HttpResponse<ErrorResponse>> {
    const error: ErrorResponse = {
      code: 'CMR-999',
      description: 'Servicio no se encuentra disponible.',
      errorType: EErrorType.Technical,
    };
    console.error(error);
    return throwError(error);
  }
}
