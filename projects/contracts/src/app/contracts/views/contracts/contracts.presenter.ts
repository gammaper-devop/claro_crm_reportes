import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { EventBus } from '@claro/commons/event-bus';
import { SessionStorage } from '@claro/commons/storage';
import {
  CRMErrorService,
  ErrorResponse,
  CRMGenericsService,
} from '@claro/crm/commons';
import { AuthService, User } from '@shell/app/core';
import {
  ContractPending,
  ContractsService,
  Customer,
  ContractPendingFilter,
} from '@contracts/app/core';
import { UTILS } from '@claro/commons';

@Injectable()
export class ContractsPresenter {
  user: User;
  payments: ContractPending[];
  customers: Customer[];
  error: ErrorResponse;
  minDate: Date;
  maxDate: Date;
  contracts: ContractPendingFilter[];

  constructor(
    private eventBus: EventBus,
    private authService: AuthService,
    private genericsService: CRMGenericsService,
    private contractsService: ContractsService,
    private errorService: CRMErrorService,
    private session: SessionStorage,
  ) {
    this.user = this.authService.getUser();

    const calendarDays = Number(
      this.user.configurations.find(config => config.key === 'calendarDays')
        ?.value || 30,
    );
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minDate = new Date(
      currentYear,
      currentMonth,
      currentDay - calendarDays,
    );
    this.maxDate = new Date(currentYear, currentMonth, currentDay);
    this.getContracts(new Date());
  }

  async getContracts(valueDate?: any) {
    const body = {
      officeCode: this.user.office,
      date: UTILS.formatISODate(valueDate),
      channel: this.user.channel,
    };
    this.error = null;
    try {
      this.payments = await this.contractsService.getContracts(body);
      this.contracts = this.filterPayments();
    } catch (error) {
      this.payments = [];
      this.contracts = [];
      this.error = this.errorService.showError(
        error,
        'CRM-990',
        true,
      );
    }
  }

  async getPaid(valueDate?: any) {
    const body = {
      officeCode: this.user.office,
      date: UTILS.formatISODate(valueDate),
      channel: this.user.channel,
    };
    this.error = null;
    try {
      this.payments = await this.contractsService.getPaid(body);
      this.contracts = this.filterPayments();
    } catch (error) {
      this.payments = [];
      this.contracts = [];
      this.error = this.errorService.showError(
        error,
        'CRM-991',
        true,
      );
    }
  }

  private filterPayments() {
    return this.payments.map(payment => ({
      secNumber: payment.secNumber || '',
      desTypeDocumentCustomer: payment.desTypeDocumentCustomer,
      numberDocumentCustomer: payment.numberDocumentCustomer,
      descTypeOperation: payment.descTypeOperation,
      phoneNumber: payment.phoneNumber,
      voucherTypeDesc: payment.voucherTypeDesc,
      invoiceSunat: payment.invoiceSunat,
      orderNumber: payment.orderNumber,
      date: payment.date,
      amount: payment.amount,
    }));
  }

  setCustomer(customer: Customer) {
    this.contractsService.setCustomer(customer);
  }

  payNav(payment: any) {
    this.session.set('navigate', '/clientes/operaciones');
    this.session.set('payment-select', payment);
    this.session.set('payment-saleSuccess', true);
    this.session.remove('customersInit');
    this.eventBus.$emit('shellNavigate', '/clientes/operaciones');
  }

  async postCancelPayment(contract: ContractPending, paid: boolean) {
    try {
      const office = this.genericsService.getOfficeDetail();
      const body = {
        secNumber: contract.secNumber || '0',
        orderNumber: contract.orderNumber,
        orderSinergy: contract.documentSynergy,
        channelCode: this.user.channel,
        interlocutorCode: office.interlocutorCode,
        codTypeOperation: contract.typeDocument,
        productType: '',
        codPointSale: contract.codPointSale,
        codPointSaleSin: contract.codPointSaleSin,
      };
      const response = await (paid
        ? this.contractsService.postContractRollback(body)
        : this.contractsService.postPaymentRollback(body));
      return !!response;
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-992',
        true,
      );
      return this.error?.code === 'IDFF12' ? null : false;
    }
  }

  async getDetailPayment(orderNumber: string, orderType: string) {
    try {
      const response = await this.contractsService.getPaymentsSummary({
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
    detailPayment: any,
    contract: ContractPendingFilter,
  ) {
    try {
      const body = {
        secNumber: detailPayment.secNumber || '0',
        officeType: detailPayment.officeType,
        idOrderMSSAP: detailPayment.idOrderMSSAP,
        operation: detailPayment.operation,
        office: this.user.office,
        officeSynergia: detailPayment.officeSynergia,
        userAccount: this.user.account,
        documentType: detailPayment.documentType,
        documentNumber: detailPayment.documentNumber,
        segment: detailPayment.segment,
        digitalFlag: detailPayment.digitalFlag,
        channelCode: this.user.channel,
        dateFront: contract.date.replace(/\//g, ''),
        emailFlag: false,
        productType:detailPayment.productType
      };
      const response = await this.contractsService.postGenerateDocuments(body);
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

  async postSearchContracts(body) {
    this.error = null;
    this.customers = undefined;
    try {
      const response = await this.contractsService.postSearchContracts(body);
      this.customers = response.clientList;
    } catch (error) {
      this.customers = [];
      this.error = this.errorService.showError(
        error,
        'CRM-995',
        true,
      );
    }
  }
}
