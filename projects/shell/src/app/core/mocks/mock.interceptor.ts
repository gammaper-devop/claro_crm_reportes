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

import { ErrorResponse, EErrorType } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';
import { UserResponse } from '../models';
import { ApiService } from '../services';

@Injectable()
export class MocksInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}

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
          const isServerOk = Math.random() > 0.1;

          if (
            request.url.match(this.apiService.generateToken) &&
            request.method === 'POST'
          ) {
            const users: UserResponse[] = require('./json/users.json');
            const account = body.userAccount;
            const password = body.password;
            let userFound = users.find(
              (user: UserResponse) => user.redUserCode === account,
            );
            if (userFound) {
              // if (userFound.password === password) {
              userFound = JSON.parse(JSON.stringify(userFound));
              delete userFound.password;
              delete userFound.pin;
              if (userFound.channelCode === '01') {
                userFound.biometricAttemptsNumber = 2;
                userFound.pinAttemptsNumber = 2;
                userFound.timerPinValidate = 10;
              } else {
                userFound.documentType = '';
                userFound.documentNumber = '';
              }
              userFound.accessToken = 'accessToken';
              userFound.refreshToken = 'refreshToken';
              userFound.expiresIn = 3600;
              userFound.refreshExpiresIn = 600;
              userFound.configurations = [
                {
                  key: 'loginVerificationType',
                  value: '2'
                },
                {
                  key: 'dashboardCAC',
                  value: '1'
                },
                {
                  key: 'dashboardDAC',
                  value: '1'
                },
                {
                  key: 'dashboardCAD',
                  value: '1'
                },
                {
                  key: 'profileShowEmail',
                  value: '1'
                },
                {
                  key: 'profileShowPhone',
                  value: '1'
                },
                {
                  key: 'operationsLogin',
                  value: '1',
                },
                {
                  key: 'portabilityByDefaultOnNewCustomer',
                  value: '1'
                },
                {
                  key: 'priorConsultation',
                  value: '0'
                },
                {
                  key: 'priorConsultationAttemptsNumber',
                  value: '3'
                },
                {
                  key: 'priorConsultationWaitTime',
                  value: '5'
                },
                {
                  key: 'biometricAttemptsNumber',
                  value: '3'
                },
                {
                  key: 'saleAttemptsNumber',
                  value: '3'
                },
                {
                  key: 'portabilityAttemptsNumber',
                  value: '3'
                },
                {
                  key: 'portabilityWaitTime',
                  value: '5'
                },
                {
                  key: 'calendarDays',
                  value: '30'
                },
                {
                  key: 'allowedProductsToDispatch',
                  value: '01|02|03|04|05|06',
                },
                {
                  key: 'flagLoyaltyDisccount',
                  value: "1",
                },
                {
                  key: "contractPersonalData",
                  value: "1|5ec338cd8586dac0bf3fa984|Aceptar uso de datos personales (Ley 29733)|https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf|true|false"
                },
                {
                  key: "contractWebFilter",
                  value: "2|5ec338cd8586dac0bf3rd562|Aceptar filtro web (Ley 30254)|https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf|true|false"
                },
                {
                  key: "contractPublicityInformation",
                  value: "3|5ec338cd8586dac0bf3pe896|Recibir información publicitaria (Ley 28493)|https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf|true|false"
                },
                {
                  key: "contractAcceptConditionDNI",
                  value: "4|5ec338cd8586dac0bf3li712|**Valida identidad y aceptación de los términos y condiciones de la contratación|https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf|true|true"
                },
                {
                  key: "contract_AcceptCondition",
                  value: "4|5ec338cd8586dac0bf3li712|**Aceptación de los términos y condiciones de la contratación|https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf'|true|true"
                },
                {
                  key: "biometricsUserBiomatch",
                  value: "LIC-PROD01",
                },
                {
                  key: "biometricsSegBiomatch",
                  value: "L1C3NcI@2020C1@40",
                },
                {
                  key: "noBiometricPrint",
                  value: "0",
                },
                {
                  key: "biometricsMessageInfo1",
                  value: "El programa se encuentra licenciado.",
                },
                {
                  key: "biometricMenu",
                  value: "0",
                }
              ];
              return this.response(userFound);
              // } else {
              //   return this.responseError('Clave incorrecta.');
              // }
            } else {
              switch (account) {
                case 'e750001':
                  return this.responseError('Cuenta inactiva.');
                case 'e750002':
                  return this.responseError(
                    `El vendedor no se encuentra registrado.\n
                    Por favor, solicitar al área de Soporte Canal CAC.`,
                  );
                case 'e750003':
                  return this.responseError(
                    'El vendedor no tiene permiso de ingresar al dashboard.',
                  );
                default:
                  return this.responseError('Cuenta de red inválida.');
              }
            }
          }

          if (
            request.url.match(this.apiService.refreshToken) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const rand = Math.random().toString().substr(-1);
            return this.response({
              newAccessToken: 'newAccessToken-' + rand,
              newRefreshToken: 'newRefreshToken-' + rand,
            });
          }

          if (
            request.url.match(this.apiService.removeToken) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response({
              result: '1 token(s) deleted',
            });
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
    data = JSON.parse(JSON.stringify(data));
    console.log('response', data);
    return of(new HttpResponse({ status: 200, body: data }));
  }

  responseError(message: string): Observable<HttpResponse<ErrorResponse>> {
    const error: ErrorResponse = {
      code: 'CMR-001',
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
