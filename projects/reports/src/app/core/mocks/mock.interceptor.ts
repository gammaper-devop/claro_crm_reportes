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
import { ErrorResponse, EErrorType, ErrorCodes } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';
import { ApiService } from '../services';
import { UserResponse } from '@shell/app/core';
//import { MultipointResponse } from '../models/multipoint.model';
import { Options } from '@claro/commons/src/models/options';
import { ConstantPool } from '@angular/compiler';
import { PortabilityParamResponse } from '../models';

@Injectable()
export class MocksInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let sleepTime = 500;
    const sleepList = [];
    console.log("MocksInterceptor Reports: ", request.url)
    // sleepList.push(this.apiService.registerConsult);
    if (sleepList.indexOf(request.url) >= 0) {
      sleepTime = 2000;
    }

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
            request.url.match(this.apiService.validateIdentification) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const users: UserResponse[] = require('@shell/app/core/mocks/json/users.json');
            const documentNumber = body.documentVendor;
            const pin = body.password;
            const userFound = users.find(
              (user: UserResponse) => user.documentNumber === documentNumber,
            );
            if (userFound) {
              if (userFound.pin === pin) {
                return this.response({ nameVendor: 'nameVendor' });
              }
              if (Math.random() > 0.7) {
                return this.responseError(ErrorCodes['CRM-994'], 'IDFF1');
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

          if (
            request.url.match(this.apiService.authSupervisor) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const users: UserResponse[] = require('@shell/app/core/mocks/json/users.json');
            const userName = body.username;
            const userFound = users.find(
              (user: UserResponse) => user.redUserCode === userName,
            );

            if (userFound) {
              return this.response({ success: true });
            } else {
              return this.responseError(
                'Ingresar usuario y/o contraseña correcta',
              );
            }
          }

          if (
            request.url.match(this.apiService.departments) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response(require('./json/department.json'));
          }

          if (
            request.url.match(this.apiService.districts) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response(require('./json/district.json'));
          }

          
          if (
            request.url.match(this.apiService.registerConsult) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (Math.random() > 0.3) {
              return this.response({ secuentailCode: '2020' });
            } else {
              return this.responseError(
                'El número ha sido portado recientemente.',
              );
            }
          }

          if (
            request.url.match(this.apiService.sellerLists) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const resportSellerList: any[] = require('./json/sellers-list.json');
            const resportSellerMax = UTILS.randomNumber(2, 4);
            const resportSellerFound = resportSellerList.filter(
              (operation, i) => i < resportSellerMax,
            );
            return this.response(resportSellerFound);
          }
          if (
            request.url.match(this.apiService.criteria) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            return this.response({
              criterias: require('./json/criterias.json'),
            });
          }

          
          if (
            request.url.match(this.apiService.generics) &&
            request.method === 'GET'
          ) {
            console.log("MocksInterceptor Reports LLego Generics Test")
            if (!isServerOk) {
              return this.serverDown();
            }

            let generics: PortabilityParamResponse[] = require('./json/status.json');
            const urlParts = request.url.split('/');
            console.log("urlParts: ", urlParts);
            const cboKey = urlParts[urlParts.length - 1];
            console.log("cboKey: ", cboKey);
            if (String(cboKey) !== 'CBO_ALL' && String(cboKey) !== 'CBO_DELIVERY') {
              console.log("Dentro: ");
              generics = generics.filter(
                generic => generic.keyCombo === String(cboKey),
              );
              console.log("generics final:  ", generics);
            }
            
            return this.response(generics);
          }

          if (
            request.url.match(this.apiService.getUserDocuments) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const declarations: any[] = require('./json/document-search.json');
            return this.response(declarations);
          }

          if (
            request.url.match(this.apiService.paymentRollback) &&
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
            (request.url.match(this.apiService.dealers)) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const dealerSelect = body.dealerCodeSalePoint;
            const dealersMain = require('./json/dealers-main.json');
            const dealersMainSelected = require('./json/dealers-selected.json');

            if (dealerSelect.length > 0) {

              return this.response(dealersMainSelected);
            }
            return this.response(dealersMain);
          }

          // end!
          return next.handle(request);
        }),
      )
      .pipe(materialize())
      .pipe(delay(sleepTime))
      .pipe(dematerialize());
  }

  response(data: any): Observable<HttpResponse<any>> {
    data = JSON.parse(JSON.stringify(data));
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
  getRandomSpecific(min, max) {
    return Math.random() * (max - min) + min;
  }
}
