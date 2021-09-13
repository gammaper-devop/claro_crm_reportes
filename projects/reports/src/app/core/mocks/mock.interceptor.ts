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

@Injectable()
export class MocksInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let sleepTime = 500;
    const sleepList = [];
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
            request.url.match(this.apiService.sellerQuery) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const sellerQuery: Options[] = require('./json/sellers.json');
            return this.response(sellerQuery);
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
            request.url.match(this.apiService.portabilityValidate) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response({ success: true });
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
            return this.response(resportSellerList);
          }

          console.log("URL1: ", request.url);
          console.log("Entro Api1: ", this.apiService.criteria);
          console.log("Request1: ", request.method);

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
          console.log("URL2: ", request.url);
          console.log("Entro Api2: ", this.apiService.generics);
          console.log("Request2: ", request.method);
          if (
            request.url.match(this.apiService.generics) && request.method === 'GET' 
          ) {
            console.log("33333333333333333");
            const portabilityParams: any[] = require('./json/status.json');
            console.log("Portabiliy", portabilityParams);
            const urlParts = request.url.split('/');
            const cboKey = urlParts[urlParts.length - 1];
            console.log("CboKey", cboKey);
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
            console.log("ParamList", paramsList);
            return this.response(paramsList);
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
            request.url.match(this.apiService.generateSec) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response({ secNumber: '2021' });
          }

          if (
            request.url.match(this.apiService.modalities) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response([
              {
                modalityDestinationCode: '01',
                modalityDestinationDescription: 'Prepago',
              },
            ]);
          }

          if (
            request.url.match(this.apiService.validateDisponibility) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const series = require('./json/series.json');
            const serieFound = series.find(
              serie => serie.serie === body.serieNumber,
            );
            if (serieFound) {
              return this.response(serieFound);
            } else {
              return this.responseError('Número de serie inválido.');
            }
          }

          if (
            request.url.match(this.apiService.validateDisponibilityRepo) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const series = require('./json/series.json');
            const serieFound = series.find(
              serie => serie.serie === body.serieNumber,
            );
            if (serieFound) {
              return this.response(serieFound);
            } else {
              return this.responseError('Número de serie inválido.');
            }
          }

          if (
            request.url.match(this.apiService.searchlines) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (Math.random() > 0.3) {
              return this.response(require('./json/searchlines.json')[0]);
            } else {
              return this.responseError('Número inválido.');
            }
          }

          if (
            request.url.match(this.apiService.ubigeos) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response(require('./json/ubigeos.json'));
          }

          if (
            request.url.match(this.apiService.addItem) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (Math.random() > 0.3) {
              return this.response({ success: true });
            } else {
              return this.responseError('Cobertura incorrecta.');
            }
          }

          if (
            request.url.match(this.apiService.saveSales) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (Math.random() > 0.1) {
              return this.response({
                orderNumber: '8010760712',
                orderNumberSynergi: '8010760712',
                orderMessage: 'success',
              });
            } else {
              return this.responseError('Error al grabar.');
            }
          }
          if (
            request.url.match(this.apiService.saveSalesRenoRepo) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (Math.random() > 0.1) {
              return this.response({
                orderNumber: '8010760712',
                orderMessage: 'success',
                orderTicket: '8010760712',
                saleNumber: '546565656',
              });
            } else {
              return this.responseError('Error al grabar.');
            }
          }

          if (
            request.url.match(this.apiService.executePaymentPorta) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            return this.response({
              /*success: 'true',
              date: '10/11/2020',*/
              
                "phones":[
                  {
                    "phone":"921099796",
                    "date":"2021-05-27T00:00:01.000-05:00"
                  },
                  {
                    "phone":"921099797",
                    "date":"2021-05-27T00:00:01.000-05:00"
                  },
                  {
                    "phone":"921099798",
                    "date":"2021-05-27T00:00:01.000-05:00"
                  }
                ]
              
            });
          }

          if (
            request.url.match(this.apiService.executePaymentAlta) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            return this.response({
              success: 'true',
              phoneNumber: '912345678',
            });
          }

          if (
            request.url.match(this.apiService.executePayment) &&
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
            (request.url.match(this.apiService.series) ||
              request.url.match(this.apiService.seriesPorta)) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const chipDescriptions = require('./json/series.json');
            return this.response(chipDescriptions);
          }

          if (
            request.url.match(this.apiService.availableDates) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            if (Math.random() > 0.3) {
              return this.response({ success: true });
            } else {
              return this.responseError('Fecha no disponible');
            }
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
