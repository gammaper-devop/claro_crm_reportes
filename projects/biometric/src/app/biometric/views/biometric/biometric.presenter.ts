import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { EventBus } from '@claro/commons/event-bus';
import { SessionStorage } from '@claro/commons/storage';
import {
  CRMErrorService,
  ErrorResponse,
  BiometricConfig,
  CRMBiometricService,
  EErrorType,
  CRMGenericsService,
  BiometricBody,
} from '@claro/crm/commons';

import { AuthService, User } from '@shell/app/core';
import {
  Customer,
  CustomerService,
  ProfileService
} from '@biometric/app/core';

import { UTILS } from '@claro/commons';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BiometricPresenter {
  user: User;
  customer: Customer;
  body: BiometricBody;
  errorSale: ErrorResponse;
  biometricConfig: BiometricConfig;

  responseError = false;
  error: ErrorResponse;
  minDate: Date;
  maxDate: Date;

  constructor(
    private biometricService: CRMBiometricService,
    private authService: AuthService,
    private customerService: CustomerService,
    private genericsService: CRMGenericsService,
    private errorService: CRMErrorService,
    private session: SessionStorage,
  ) {
 //   this.getDocuments();

 //  this.showSaleError()
  }

 /*  showSaleError() {
    this.errorSale = {
      code: '',
      title: 'Error al grabar la venta.',
      description:
        (this.error && this.error.description) ||
        'Lo sentimos, no hemos podido grabar la venta correctamente',
      errorType: this.error.errorType,
    };
  } */

  async getBiometricConfig(
    officeSaleCode: string,
    productType: string,
    processCode: string,
  ) {
    this.error = null;
     try {
      const response = await this.biometricService.getBestFingerprint({
        officeSaleCode,
        processCode,
        operationType: '02',
        productType,
        orderNumber: '',
      });
       let config = response.configuration;
        config.noBiometricFlag = false;
        config.inabilityFlag = false;
        config.omissionFlag = false;
       this.biometricConfig = config;
      console.log('this.biometricConfig present', this.biometricConfig)
      return !!this.biometricConfig.biometricFlag;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-943');
      return false;
    } 
  }



 /*  async getDocuments() {
    this.user = await this.authService.getUser();
    const body = {
      channel: this.user.channel,
      office: this.user.office,
      flagCensus: false
    };
    this.options$ = this.searchService
      .getList(body)
      .pipe(
        catchError(error => {
          this.responseError = true;
          return throwError(error);
        }),
      );
  } */

/*   async postSearch(body) {
    this.error = null;
    this.customers = undefined;
    try {
      const response = await this.searchService.postSearch(body);
      this.customers = response.clientList;
    } catch (error) {
      if (error.errorType === EErrorType.Functional) {
        this.customers = [];
      } else {
        this.error = error;
      }
    }
  }
  setCustomer(customer: Customer) {
    this.customerService.setCustomer(customer);
  }
 */
}
