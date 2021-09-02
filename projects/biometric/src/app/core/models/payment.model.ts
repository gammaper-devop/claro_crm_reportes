import { UTILS } from '@claro/commons';

export interface PaymentPendingResponse {
  secNumber: string;
  customerName: string;
  phoneNumber: string;
  amount: string;
  balance: string;
  documentTypeDescription: string;
  invoiceSunat: string;
  date: string;
  documentSap: string;
  utilization: string;
  dues: string;
  money: string;
  neto: string;
  documentSynergy: string;
  typeDocument: string;
  flagReposition: string;
  warrantyNumber: string;
  billedClass: string;
  flagMultipunto: string;
  email: string;
}

export class PaymentPending {
  secNumber: string;
  customerName: string;
  phoneNumber: string;
  amount: string;
  balance: string;
  documentTypeDescription: string;
  invoiceSunat: string;
  date: string;
  orderNumber: string;
  utilization: string;
  dues: string;
  money: string;
  neto: string;
  documentSynergy: string;
  typeDocument: string;
  flagReposition: string;
  warrantyNumber: string;
  billedClass: string;
  flagMultipunto: string;
  email: string;
  operationType: { value: string, label: string };

  operationTypes = {
    POR: {
      value: '01',
      label: 'Portabilidad',
    },
    ALT: {
      value: '02',
      label: 'Línea Nueva',
    },
    REN: {
      value: '03',
      label: 'Renovación',
    },
    REP: {
      value: '04',
      label: 'Reposición',
    },
  };

  constructor(payment: PaymentPendingResponse) {
    this.secNumber = payment.secNumber ? payment.secNumber : '';
    this.customerName = payment.customerName ? payment.customerName : '';
    this.phoneNumber = payment.phoneNumber ? payment.phoneNumber : '';
    this.amount = payment.amount ? Number(payment.amount).toFixed(2) : '';
    this.balance = payment.balance ? payment.balance : '';
    this.documentTypeDescription = payment.documentTypeDescription
      ? payment.documentTypeDescription
      : '';
    this.invoiceSunat = payment.invoiceSunat ? payment.invoiceSunat : '';
    this.date = UTILS.formatDate(payment.date) || '';
    this.orderNumber = payment.documentSap ? payment.documentSap : '';
    this.utilization = payment.utilization ? payment.utilization : '';
    this.dues = payment.dues ? payment.dues : '';
    this.money = payment.money ? payment.money : '';
    this.neto = payment.neto ? payment.neto : '';
    this.documentSynergy = payment.documentSynergy
      ? payment.documentSynergy
      : '';
    this.typeDocument = payment.typeDocument ? payment.typeDocument : 'POR';
    this.flagReposition = payment.flagReposition ? payment.flagReposition : '';
    this.warrantyNumber = payment.warrantyNumber ? payment.warrantyNumber : '';
    this.billedClass = payment.billedClass ? payment.billedClass : '';
    this.flagMultipunto = payment.flagMultipunto ? payment.flagMultipunto : '';
    this.email = payment.email ? payment.email : '';
    this.operationType = this.operationTypes[this.typeDocument];
  }
}
