export interface GenerateDocumentResponse {
  fileName: string;
  documentBase64: string;
}

export class GenerateDocument {
  fileName: string;
  documentBase64: string;

  constructor(tradeAgreement: GenerateDocumentResponse) {
    this.fileName =  tradeAgreement.fileName ? tradeAgreement.fileName : '';
    this.documentBase64 = tradeAgreement.documentBase64 ? tradeAgreement.documentBase64 : '';
  }
}
