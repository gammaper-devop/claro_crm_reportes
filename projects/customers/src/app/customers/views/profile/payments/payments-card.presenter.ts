import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UTILS } from '@claro/commons';
import { SessionStorage } from '@claro/commons/storage';
import {
  ErrorResponse,
  CRMGenericsService,
  Office,
  CRMErrorService,
} from '@claro/crm/commons';
import { User } from '@shell/app/core';
import {
  PortabilityService,
  PaymentsService,
  Customer,
} from '@customers/app/core';

@Injectable()
export class PaymentsCardPresenter {
  error: ErrorResponse;
  office: Office;

  constructor(
    private router: Router,
    private genericsService: CRMGenericsService,
    private portabilityService: PortabilityService,
    private paymentService: PaymentsService,
    private session: SessionStorage,
    private errorService: CRMErrorService,
  ) {
    this.office = this.genericsService.getOfficeDetail();
  }

  async postCancelPayment(
    secNumber: string,
    orderNumber: string,
    orderSinergy: string,
    channelCode: string,
  ) {
    try {
      const office = this.genericsService.getOfficeDetail();
      const response = await this.portabilityService.postPaymentRollback({
        secNumber,
        orderNumber,
        orderSinergy,
        channelCode,
        interlocutorCode: office.interlocutorCode,
      });
      return !!response;
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-976',
        true,
      );
      return this.error?.code === 'IDFF12' ? null : false;
    }
  }

  payNav(payment: any) {
    this.session.set('payment-select', payment);
    this.router.navigate(['/clientes/operaciones']);
  }

  async getDetailPayment(orderNumber: string, orderType: string) {
    try {
      const response = await this.paymentService.getPaymentsSummary({
        orderNumber,
        orderType,
      });
      return response;
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-979',
        true,
      );
    }
  }

  async postGenerateDocuments(
    customer: Customer,
    user: User,
    detailPayment,
    date: string,
  ) {
    try {
      const body = {
        secNumber: detailPayment.secNumber || '0',
        officeType: detailPayment.officeType,
        idOrderMSSAP: detailPayment.idOrderMSSAP,
        operation: detailPayment.operation,
        office: this.office.officeCode,
        officeSynergia: detailPayment.officeSynergia,
        userAccount: user.account,
        documentType: customer.documentTypeCode,
        documentNumber: customer.documentNumber,
        segment: detailPayment.segment,
        digitalFlag: detailPayment.digitalFlag,
        channelCode: user.channel,
        dateFront: date.replace(/\//g, ''),
        emailFlag: false,
        productType:detailPayment.productType
      };
      const response = await this.portabilityService.postGenerateDocuments(
        body,
      );
      if (response) {
        response.forEach(document => {
          setTimeout(() => {
            if(document.fileName !== '_2_1__1_CONS_CAM_SIMREPO.pdf'){
              this.savePDF(document.fileName, document.documentBase64);
            }
          }, 1000);
        });
      }
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-973',
        true,
      );
    }
  }

  savePDF(fileName, documentBase64) {
    const binary = atob(documentBase64.replace(/\s/g, ''));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([view], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(blob);
    if (this.isIE()) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      window.open(fileURL);
    }
  }

  isIE() {
    const bw = navigator.userAgent;
    const isIE = bw.indexOf('MSIE ') > -1 || bw.indexOf('Trident/') > -1;
    return isIE;
  }
}
