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
import { EChannel, UserResponse } from '@shell/app/core';
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
            request.url.match(this.apiService.validateIdentification) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const users: UserResponse[] = require('@shell/app/core/mocks/json/users.json');
            const documentType = params.get('documentType');
            const documentNumber = params.get('documentNumber');
            const pin = params.get('pin');
            let userFound = users.find(
              (user: UserResponse) =>
                user.documentType === documentType &&
                user.documentNumber === documentNumber,
            );
            if (userFound) {
              if (
                userFound.channelCode !== EChannel.CAD ||
                (userFound.channelCode === EChannel.CAD &&
                  userFound.pin === pin)
              ) {
                userFound = JSON.parse(JSON.stringify(userFound));
                userFound.biometricAttemptsNumber = 2;
                userFound.pinAttemptsNumber = 2;
                userFound.timerPinValidate = 10;
                delete userFound.password;
                delete userFound.pin;
                return this.response(userFound);
              } else {
                return this.responseError('Pin incorrecto.');
              }
            } else {
              switch (documentNumber) {
                case '12345671':
                  return this.responseError(
                    `El vendedor no se encuentra registrado.
                    Por favor, solicitar al área de Soporte Canal DAC.`,
                  );
                case '12345672':
                  return this.responseError(
                    `Por favor, solicitar al área de Soporte Canal DAC
                    que actualice su punto de venta.`,
                  );
                case '12345673':
                  return this.responseError(
                    'El vendedor no tiene permiso de ingresar al dashboard.',
                  );
                default:
                  return this.responseError('Documento Inválido.');
              }
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
