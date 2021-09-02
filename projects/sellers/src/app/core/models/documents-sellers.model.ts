export interface DocumentsSellersResponse {
  criteriaId: string;
  documentTypeId: string;
  criteriaName: string;
  criteriaFormat: string;
  criteriaMaxLength: string;
  criteriaMinLength: string;
}

export class DocumentsSellers {
  value: string;
  label: string;
  criteriaId: string;
  criteriaFormat: string;
  criteriaMaxLength: string;
  criteriaMinLength: string;
  constructor(documentSeller: DocumentsSellersResponse) {
    this.value = documentSeller.documentTypeId ? documentSeller.documentTypeId : '';
    this.label = documentSeller.criteriaName
      ? documentSeller.criteriaName
      : '';
    this.criteriaId = documentSeller.criteriaId
      ? documentSeller.criteriaId
      : '';
    this.criteriaFormat = documentSeller.criteriaFormat
    ? documentSeller.criteriaFormat
    : '';
    this.criteriaMaxLength = documentSeller.criteriaMaxLength
    ? documentSeller.criteriaMaxLength
    : '';
    this.criteriaMinLength = documentSeller.criteriaMinLength
    ? documentSeller.criteriaMinLength
    : '';
  }
}
