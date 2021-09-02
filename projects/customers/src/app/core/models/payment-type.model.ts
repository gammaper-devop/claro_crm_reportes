export interface PaymentTypeResponse {
  code: string;
  description: string;
  digitCount?: string;
}

export class PaymentType {
  value: string;
  label: string;
  idMaxlength: string;
  constructor(paymentType: PaymentTypeResponse) {
    this.value = paymentType.code ? paymentType.code : '';
    this.label = paymentType.description
      ? paymentType.description
      : '';
    this.idMaxlength = paymentType.digitCount
      ? paymentType.digitCount
      : '';
  }
}
