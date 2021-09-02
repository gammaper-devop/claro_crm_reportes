export interface TradeAgreementsResponse {
  idTradeAgreement: string;
  tradeAgreementDesc: string;
  file: string;
  isEnable: boolean;
  isRequired: boolean;
}

export interface TradeAgreementsOptions {
  id: string;
  description: string;
  file: string;
  isEnable: boolean;
  isRequired: boolean;
}

export class TradeAgreementsType {
  idTradeAgreement: string;
  tradeAgreementDesc: string;
  file: string;
  isEnable: boolean;
  isRequired: boolean;

  constructor(tradeAgreement: TradeAgreementsResponse) {
    this.idTradeAgreement =  tradeAgreement.idTradeAgreement ? tradeAgreement.idTradeAgreement : '';
    this.tradeAgreementDesc = tradeAgreement.tradeAgreementDesc ? tradeAgreement.tradeAgreementDesc : '';
    this.file = tradeAgreement.file ? tradeAgreement.file : '';
    this.isEnable = tradeAgreement.isEnable ? tradeAgreement.isEnable : false;
    this.isRequired = tradeAgreement.isRequired ? tradeAgreement.isRequired : false;
  }
}
