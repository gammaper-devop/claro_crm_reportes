export interface DocumentTypeResponse {
  documentType: string;
  documentDescription: string;
}

export class DocumentType {
  value: string;
  label: string;

  constructor(documentType: DocumentTypeResponse) {
    this.value = documentType.documentType ? documentType.documentType : '';
    this.label = documentType.documentDescription
      ? documentType.documentDescription
      : '';
  }
}
