import { UTILS } from '@claro/commons';

export interface ContractPendingResponse {
  secNumber: string;
  customerName: string;
  phoneNumber: string;
  amount: string;
  balance: string;
  voucherTypeDesc: string;
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
  codTypeDocumentCustomer: string;
  desTypeDocumentCustomer: string;
  numberDocumentCustomer: string;
  desTypeProduct: string;
  codPointSale: string;
  codPointSaleSin: string;
  codPaymentSunat: string;
  pedicCurrency: string;
  pedinBalance: string;
  datePaymentAccountancy: string;
  codTypeOperation: string;
  descTypeOperation: string;
  flagBio: boolean;
}

export class ContractPendingFilter {
  secNumber: string;
  desTypeDocumentCustomer: string;
  numberDocumentCustomer: string;
  descTypeOperation: string;
  phoneNumber?: string;
  voucherTypeDesc: string;
  invoiceSunat: string;
  orderNumber: string;
  date: string;
  amount: string;
}

export class ContractPending {
  secNumber: string;
  customerName: string;
  phoneNumber: string;
  amount: string;
  balance: string;
  voucherTypeDesc: string;
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
  codTypeDocumentCustomer: string;
  desTypeDocumentCustomer: string;
  numberDocumentCustomer: string;
  desTypeProduct: string;
  codPointSale: string;
  codPointSaleSin: string;
  codPaymentSunat: string;
  pedicCurrency: string;
  pedinBalance: string;
  datePaymentAccountancy: string;
  codTypeOperation: string;
  descTypeOperation: string;
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

  constructor(contract: ContractPendingResponse) {
    this.secNumber = contract.secNumber ? contract.secNumber : '';
    this.customerName = contract.customerName ? contract.customerName : '';
    this.phoneNumber = contract.phoneNumber ? contract.phoneNumber : '';
    this.amount = contract.amount ? Number(contract.amount).toFixed(2) : '';
    this.balance = contract.balance ? contract.balance : '';
    this.voucherTypeDesc = contract.voucherTypeDesc
      ? contract.voucherTypeDesc
      : '';
    this.invoiceSunat = contract.invoiceSunat ? contract.invoiceSunat : '';
    this.date = UTILS.formatDate(contract.date) || '';
    this.orderNumber = contract.documentSap ? contract.documentSap : '';
    this.utilization = contract.utilization ? contract.utilization : '';
    this.dues = contract.dues ? contract.dues : '';
    this.money = contract.money ? contract.money : '';
    this.neto = contract.neto ? contract.neto : '';
    this.documentSynergy = contract.documentSynergy
      ? contract.documentSynergy
      : '';
    this.typeDocument = contract.typeDocument ? contract.typeDocument : 'POR';
    this.flagReposition = contract.flagReposition
      ? contract.flagReposition
      : '';
    this.warrantyNumber = contract.warrantyNumber
      ? contract.warrantyNumber
      : '';
    this.billedClass = contract.billedClass ? contract.billedClass : '';
    this.flagMultipunto = contract.flagMultipunto
      ? contract.flagMultipunto
      : '';
    this.email = contract.email ? contract.email : '';
    this.codTypeDocumentCustomer = contract.codTypeDocumentCustomer
      ? contract.codTypeDocumentCustomer
      : '';
    this.desTypeDocumentCustomer = contract.desTypeDocumentCustomer
      ? contract.desTypeDocumentCustomer
      : '';
    this.numberDocumentCustomer = contract.numberDocumentCustomer
      ? contract.numberDocumentCustomer
      : '';
    this.desTypeProduct = contract.desTypeProduct
      ? contract.desTypeProduct
      : '';
    this.codPointSale = contract.codPointSale ? contract.codPointSale : '';
    this.codPointSaleSin = contract.codPointSaleSin
      ? contract.codPointSaleSin
      : '';
    this.codPaymentSunat = contract.codPaymentSunat
      ? contract.codPaymentSunat
      : '';
    this.pedicCurrency = contract.pedicCurrency ? contract.pedicCurrency : '';
    this.pedinBalance = contract.pedinBalance ? contract.pedinBalance : '';
    this.datePaymentAccountancy = contract.datePaymentAccountancy
      ? contract.datePaymentAccountancy
      : '';
    this.codTypeOperation = contract.codTypeOperation
      ? contract.codTypeOperation
      : '';
    this.descTypeOperation = contract.descTypeOperation
      ? contract.descTypeOperation
      : '';
    this.operationType = this.operationTypes[this.typeDocument];
  }
}
