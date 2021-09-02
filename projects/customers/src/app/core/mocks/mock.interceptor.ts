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
import { DeclarationKnowledgeResponse } from '@customers/app/core/models/declaration-knowledge.model';
import { GenerateDocumentResponse } from '@customers/app/core/models/generate-documents.models';
import { PortabilityRequestResponse } from '@customers/app/core/models/portability-request.model';
import { ECriteriaType } from '../enums';
import {
  CustomerResponse,
  OmissionPinResponse,
  OperationResponse,
  PaymentPendingResponse,
  TradeAgreementsResponse,
} from '../models';
import { ApiService } from '../services';
import { UserResponse } from '@shell/app/core';
import { MultipointResponse } from '../models/multipoint.model';
import { Options } from '@claro/commons/src/models/options';

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
            request.url.match(this.apiService.multipointQuery) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const consultType = body.consultType;
            const channelsMultipoint: MultipointResponse = require('./json/channels-multipoint.json');
            const officesMultipoint: MultipointResponse = require('./json/offices-multipoint.json');

            if (consultType === '1') {
              return this.response(channelsMultipoint);
            } else {
              const response = JSON.parse(JSON.stringify(officesMultipoint));
              if (Math.random() > 0.5) {
                response.listMultipoint = response.listMultipoint.slice(0, 1);
              }
              return this.response(response);
            }
          }

          if (
            request.url.match(this.apiService.omissionPin) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const omission: OmissionPinResponse[] = require('./json/omission-pin.json');
            return this.response(omission);
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
            request.url.match(this.apiService.provinces) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response(require('./json/province.json'));
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
            request.url.match(this.apiService.customerAdd) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const customers: CustomerResponse[] = require('./json/customers.json');
            return this.response(
              customers[UTILS.randomNumber(0, customers.length - 1)],
            );
          }

          if (
            request.url.match(this.apiService.operations) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const operations: OperationResponse = require('./json/operations.json');
            const isEnabled = Math.random() > 0.1;
            const operationsFound = operations.operations.map(operation => {
              operation.isEnabled = isEnabled;
              return operation;
            });
            return this.response({
              operations: operationsFound,
              warningMessage: operations.warningMessage,
            });
          }

          if (
            request.url.match(this.apiService.maxlines) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const maxlines = {
              quantityLineasAccumulated: 9,
              quantityLinesAvailable: UTILS.randomNumber(2, 4),
              quantityLinesAllowedChip: UTILS.randomNumber(1, 2),
              quantityLinesAllowedPack: UTILS.randomNumber(1, 3),
              quantityLinesMaximum: 10,
              warningMessage:
                'El cliente ha excedido las 10 líneas permitidas, recuerda que debe firmar la Declaración Jurada',
            };
            return this.response(maxlines);
          }

          if (
            request.url.match(this.apiService.portabilityParams) &&
            request.method === 'GET'
          ) {
            const portabilityParams: any[] = require('./json/portability-param.json');
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
            request.url.match(this.apiService.previewConsult) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const saleOptions: any[] = require('./json/sale-options.json');
            if (!body.phones) {
              if (Math.random() > 0.5) {
                if (Math.random() > 0.3) {
                  const response: any = {
                    activationDate: '2020-05-31',
                    saleTypeAllowed: saleOptions,
                  };
                  if (Math.random() > 0.4) {
                    response.dueFlag = true;
                    response.reasonDescription = 'Tiene deudas.';
                  }
                  return this.response([response]);
                } else {
                  return this.responseError(
                    'El número ha sido portado recientemente.',
                  );
                }
              } else {
                return this.responseError('');
              }
            } else if (body.phones === '0') {
              return this.response([
                {
                  activationDate: '2020-05-31',
                  saleTypeAllowed: saleOptions,
                },
              ]);
            } else {
              const phones: string[] = body.phones.split(',');
              return this.response(
                phones.map(phone => ({
                  phoneNumber: phone,
                  saleTypeAllowed: saleOptions,
                })),
              );
            }
          }

          if (
            request.url.match(this.apiService.newLineOptions) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            let providers = require('./json/sale-newline-options.json');
            if (Math.random() > 0.5) {
              const providersFound = providers.slice();
              providers = providersFound.splice(1, 1);
            }
            return this.response(providers);
          }

          if (
            request.url.match(this.apiService.documentDeclare) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const declarations: DeclarationKnowledgeResponse[] = require('./json/document-declare.json');
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
            request.url.match(this.apiService.officeDetails) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response(require('./json/office.json'));
          }

          if (
            request.url.match(this.apiService.promotions) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            if (!body.planCode) {
              return this.response([
                {
                  promotionCode: '01',
                  promotionDescription: 'Internet',
                },
                {
                  promotionCode: '02',
                  promotionDescription: 'Promoción 2',
                },
              ]);
            } else {
              return this.response(require('./json/promotions.json'));
            }
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
            request.url.match(this.apiService.customersReasons) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            return this.response(require('./json/customers-reasons.json'));
          }

          if (
            request.url.match(this.apiService.tgfiReasons) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            return this.response(require('./json/tgfi-reasons.json'));
          }

          if (
            request.url.match(this.apiService.dispatchOptions) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            return this.response(require('./json/dispatch-options.json'));
          }

          if (
            request.url.match(this.apiService.points) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            return this.response(require('./json/claro-points.json'));
          }

          if (
            request.url.match(this.apiService.campaigns) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response(require('./json/campaigns.json'));
          }

          if (
            request.url.match(this.apiService.prices) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const prices = require('./json/prices.json');
            const mockValue = this.getRandomSpecific(1, 5);

            if (mockValue <= 3) {
              prices[1].equipmentSku = '100000000000000000002';
            } else {
              prices[1].equipmentSku = '';
            }
            if (mockValue <= 2.5) {
              prices[2].equipmentSku = '56565656565656565656';
            } else {
              prices[2].equipmentSku = '';
            }
            if (body.equipmentSeries && body.chipSeries) {
              return this.response([prices[0], prices[1]]);
            } else if (body.chipSeries && !body.equipmentSeries) {
              return this.response([prices[2]]);
            } else if (!body.chipSeries && body.equipmentSeries) {
              return this.response([prices[3]]);
            }
          }

          if (
            request.url.match(this.apiService.plans) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response(require('./json/plans.json'));
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
            request.url.match(this.apiService.populatedCenters) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            return this.response(require('./json/populated-centers.json'));
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
            request.url.match(this.apiService.documentsSign) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const tradeAgreement: TradeAgreementsResponse[] = require('./json/trade-agreements.json');
            return this.response(tradeAgreement);
          }

          if (
            request.url.match(this.apiService.portabilityRequest) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const portaRequest: PortabilityRequestResponse[] = require('./json/request-portability.json');
            return this.response(
              portaRequest[UTILS.randomNumber(0, portaRequest.length - 1)],
            );
          }

          if (
            request.url.match(this.apiService.documentPayments) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const ticketsType: any[] = require('./json/payment-tickets-type.json');
            return this.response(ticketsType);
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
            request.url.match(this.apiService.payment) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const payments: PaymentPendingResponse[] = require('./json/payments.json');
            const paymentsMax = UTILS.randomNumber(1, 3);
            const paymentsFound = payments.filter(
              (operation, i) => i < paymentsMax,
            );
            return this.response(paymentsFound);
          }

          if (
            request.url.match(this.apiService.paymentDetail) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const paymentsDetail = require('./json/payment-detail.json');
            return this.response(paymentsDetail[0]);
          }
          if (
            request.url.match(this.apiService.materialDescriptions) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const chipDescriptions = require('./json/materials.json');
            return this.response(chipDescriptions);
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
            request.url.match(this.apiService.addressIdentifier) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const addressIdentifier = require('./json/addresses-identifier.json');
            return this.response(addressIdentifier);
          }

          if (
            request.url.match(this.apiService.addressType) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const addressType = require('./json/addresses-type.json');
            return this.response(addressType);
          }

          if (
            request.url.match(this.apiService.suggestedDates) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const suggestedDates = require('./json/suggested-dates.json');
            return this.response(suggestedDates);
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

          if (
            request.url.match(this.apiService.providers) &&
            request.method === 'GET'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            const providers = require('./json/providers.json');
            return this.response(providers);
          }

          if (
            request.url.match(this.apiService.paymentTypes) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }

            const paymentCode = body.paymentCode;
            const paymentTypes = require('./json/payment-types.json');
            const paymentMethods = require('./json/payment-methods.json');

            if (paymentCode === '') {
              return this.response(paymentTypes);
            } else if (paymentCode === '1') {
              return this.response(paymentMethods[0].onlinePayments);
            } else if (paymentCode === '2') {
              return this.response(paymentMethods[1].accountChargePayments);
            } else {
              return this.response(paymentMethods[2].onSitePayments);
            }
          }

          if (
            request.url.match(this.apiService.stockValidation) &&
            request.method === 'POST'
          ) {
            if (!isServerOk) {
              return this.serverDown();
            }
            if (Math.random() > 0.3) {
              return this.response({ success: true });
            } else {
              return this.responseError('Stock no disponible');
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
