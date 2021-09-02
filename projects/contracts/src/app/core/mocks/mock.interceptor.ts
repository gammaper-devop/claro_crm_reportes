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
import { ApiService } from '@contracts/app/core/services';
import { UTILS } from '@claro/commons';
import { ContractPendingResponse, GenerateDocumentResponse } from '../models';
import { CustomerResponse } from '../models/customer.model';
import { ECriteriaType } from '../enums';

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
            (request.url.match(this.apiService.pending) ||
              request.url.match(this.apiService.paid)) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            //console.log("Ingreso al servicio de contratos/pagados");
            if (Math.random() > 0.3) {
              const payments: ContractPendingResponse[] = require('./json/contracts.json');
              const paymentsMax = UTILS.randomNumber(1, 5);
              const paymentsFound = payments.filter(
                (operation, i) => i < paymentsMax,
              );
              return this.response(paymentsFound);
            } else {
              return this.responseError('No se encontraron contratos.');
            }
          }

          if (
            (request.url.match(this.apiService.paymentRollback) ||
              request.url.match(this.apiService.contractRollback)) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            return this.response({
              success: 'true',
            });
          }

          if (
            request.url.match(this.apiService.paymentDetail) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const paymentsDetails = require('./json/payment-detail.json');
            const paymentDetail = paymentsDetails[0];
            paymentDetail.flagBio = Math.random() > 0.4;
            return this.response(paymentDetail);
          }

          if (
            request.url.match(this.apiService.generateDocuments) &&
            request.method === 'POST'
          ) {
            const documents: GenerateDocumentResponse[] = require('./json/generate-documents.json');

            if (!isServerOk) {
              return this.serverDown();
            } else {
              return this.response(documents);
            }
          }

          if (
            request.url.match(this.apiService.search) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const customers: CustomerResponse[] = require('./json/customers.json');
            let customersFound: CustomerResponse[];

            if (params.get('criteriaId') === ECriteriaType.PHONE) {
              customersFound = customers.filter(
                customer => customer.phoneNumber === params.get('searchText'),
              );
            } else {
              customersFound = customers.filter(
                customer =>
                  customer.documentNumber === params.get('searchText'),
              );
            }
            return this.response({ clientList: customersFound });
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
