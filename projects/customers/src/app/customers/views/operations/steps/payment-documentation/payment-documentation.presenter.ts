import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MemoryStorage } from '@claro/commons/storage';
import {
  ErrorResponse,
  EErrorType,
  SnackbarService,
  ErrorCodes,
  Office,
  CRMGenericsService,
} from '@claro/crm/commons';
import { User } from '@shell/app/core';
import {
  Customer,
  IParameter,
  PortabilityService,
  ReplacementService,
  Line,
} from '@customers/app/core';
import { UTILS } from '@claro/commons';
@Injectable()
export class PaymentDocumentationPresenter {
  options$: Observable<IParameter[]>;
  error: ErrorResponse;
  office: Office;

  constructor(
    private router: Router,
    private memory: MemoryStorage,
    private snackbarService: SnackbarService,
    private portabilityService: PortabilityService,
    private replacementService: ReplacementService,
    private genericsService: CRMGenericsService,
  ) {
    this.options$ = this.portabilityService.getPaymentTicketTypes().pipe(
      catchError(error => {
        this.showError(error, 'CRM-974');
        return throwError(error);
      }),
    );
    this.office = this.genericsService.getOfficeDetail();
  }

  async postExecutePaymentPorta(
    form: FormGroup,
    customer: Customer,
    user: User,
    secNumber: string,
    orderNumber: string,
    phones: string[],
    email: string,
    saleOperationType: string,
    digitalFlag: boolean,
  ) {
    try {
      const body = {
        secNumber: secNumber,
        orderNumber: orderNumber,
        officeSale: this.office.officeCode,
        documentNumber: customer.documentNumber,
        documentType: customer.documentTypeCode,
        referenceNumber: form.get('referenceNumber').value,
        storeCode: form.get('storeCode').value,
        boxCode: form.get('boxCode').value,
        ballotCode: form.get('ballotCode').value,
        userAccount: user.account,
        digitalFlag: digitalFlag,
        fullName: customer.fullName,
        phoneNumbers: phones,
        interlocutorCode: this.office.interlocutorCode,
      };
      
      const response = await this.portabilityService.postExecutePaymentPorta2(
        body,
      );
    
      
      if (response) {
        this.memory.set('successData', {
          name: customer.name,
          email,
          phones,
          saleOperationType: saleOperationType,
          date: response.phones[0].date,
        });
        this.router.navigate(['/clientes/venta-exitosa']);
      }
    } catch (error) {
      this.showError(error, 'CRM-975');
    }
  }

  async postExecutePaymentAlta(
    form: FormGroup,
    customer: Customer,
    user: User,
    orderNumber: string,
    orderNumberSynergi: string,
    phones: string[],
    email: string,
    saleOperationType: string,
    digitalFlag: boolean,
    productType: string,
  ) {
    try {
      const body = {
        orderNumber: orderNumber,
        documentSap: orderNumber, // TODO orderNumberSynergi
        customerId: customer.customerCodePublic || '0',
        referenceNumber: form.get('referenceNumber').value,
        storeCode: form.get('storeCode').value,
        boxCode: form.get('boxCode').value,
        ballotCode: form.get('ballotCode').value,
        userAccount: user.account,
        digitalFlag: digitalFlag,
        fullName: customer.fullName,
        phoneNumbers: phones,
        interlocutorCode: this.office.interlocutorCode,
        productType: productType,
      };
      const response = await this.portabilityService.postExecutePaymentAlta(
        body,
      );
      if (response) {
        this.memory.set('successData', {
          name: customer.name,
          email,
          phones: response.phoneNumber.split(', '),
          saleOperationType: saleOperationType,
        });
        this.router.navigate(['/clientes/venta-exitosa']);
      }
    } catch (error) {
      this.showError(error, 'CRM-975');
    }
  }

  async postExecutePaymentRenoRepo(
    form: FormGroup,
    customer: Customer,
    user: User,
    orderNumber: string,
    phones: string[],
    email: string,
    saleOperationType: string,
    lineOptionValue: string,
  ) {
    try {
      const data = form.value;
      const referenceNumber = data.storeCode + data.boxCode + data.ballotCode;
      const body = {
        orderNumber: orderNumber,
        typeDocumentPaid: data.paymentTicket,
        ticket: data.referenceNumber,
        referenceNumber: referenceNumber,
        channel: user.channel,
        codPointSale: this.office.officeCode,
        codPointSaleSin: this.office.interlocutorCode,
        fullNameAdviser: user.name,
        fullNameCustomer: customer.fullName,
        typeOperation: saleOperationType,
        userAccount: user.account,
        phoneNumber: phones[0],
        flagCustomer: '1',
        saleDate: UTILS.formatISODate(),
      };
      const response = await this.replacementService.postExecutePayment(body);
      if (response) {
        this.memory.set('successData', {
          name: customer.name,
          email,
          phones,
          saleOperationType: saleOperationType,
          lineOptionValue: lineOptionValue,
        });
        this.router.navigate(['/clientes/venta-exitosa']);
      }
    } catch (error) {
      this.showError(error, 'CRM-975');
    }
  }

  showError(error: ErrorResponse, code?: string) {
    this.snackbarService.show(
      error.errorType === EErrorType.Functional
        ? error.description
        : ErrorCodes[code],
      'error',
    );
  }
}
