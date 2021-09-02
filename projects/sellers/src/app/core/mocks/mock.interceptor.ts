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
import { SellerResponse } from '../models';
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
          const isServerOk = Math.random() > 0;

          if (
            request.url.match(this.apiService.searchSellers) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const sellers: SellerResponse[] = require('./json/sellers.json');
            const sellersNetworkAccount: SellerResponse[] = require('./json/sellers-networkAccount.json');
            if (body.searchType === '2') {
              return this.response(sellersNetworkAccount);
            } else {
              return this.response(sellers);              
            }
          }

          if (
            request.url.match(this.apiService.documentSearch) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const docSearch: any[] = require('./json/document-search.json');
            return this.response(docSearch);
          }

          if (
            request.url.match(this.apiService.registerSellers) &&
            request.method === 'DELETE'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            if (Math.random() > 0.3) {
              return this.response({ success: true });
            } else {
              return this.responseError(
                'Lo sentimos, no se encuentra disponible el servicio para dar de baja al vendedor.',
              );
            }
          }

          if (
            request.url.match(this.apiService.networkAccountTypes) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const networkAccountTypes: any[] = require('./json/networkAccountTypes.json');
            return this.response(networkAccountTypes);
          }

          if (
            request.url.match(this.apiService.portabilityParams) &&
            request.method === 'GET'
          ) {
            const portabilityParams: any[] = require('./json/status.json');
            const urlParts = request.url.split('/');
            const cboKey = urlParts[urlParts.length - 1];
            const paramRequired = params.get('idService')
              ? params.get('idService')
              : '';

            if (!isServerOk) {
              return this.serverDown();
            }

            const paramsList = portabilityParams.filter(
              generic =>
                generic.keyCombo === String(cboKey) &&
                generic.paramRequired === String(paramRequired),
            );
            return this.response(paramsList);
          }

          if (
            request.url.match(this.apiService.phoneValidate) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            if (Math.random() > 0.3) {
              return this.response({ success: true });
            } else {
              return this.responseError(
                'Esta línea no pertenece al documento ingresado',
              );
            }
          }

          if (
            request.url.match(this.apiService.registerSellers) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            if (Math.random() > 0.3) {
              return this.response({ success: true });
            } else {
              return this.responseError(
                'No se pudo registrar al vendedor',
              );
            }
          }

          if (
            request.url.match(this.apiService.registerSellers) &&
            request.method === 'PUT'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            if (Math.random() > 0.3) {
              return this.response({ success: true });
            } else {
              return this.responseError(
                'No se pudo actualizar al vendedor',
              );
            }
          }
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
