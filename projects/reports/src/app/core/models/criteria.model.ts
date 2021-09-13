export interface CriteriaResponse {
  criteriaId: string;
  criteriaName: string;
  documentTypeId?: string;
  criteriaFormat: string;
  criteriaMaxLength: number;
  criteriaMinLength: number;
}

export class Criteria {
  value: string;
  label: string;
  documentTypeId: string;
  criteriaFormat: string;
  criteriaMaxLength: number;
  criteriaMinLength: number;

  constructor(criteria: CriteriaResponse) {
    this.value = criteria.criteriaId ? criteria.criteriaId : '';
    this.label = criteria.criteriaName ? criteria.criteriaName : '';
    this.documentTypeId = criteria.documentTypeId
      ? criteria.documentTypeId
      : '';
    this.criteriaFormat = criteria.criteriaFormat
      ? criteria.criteriaFormat
      : '';
    this.criteriaMaxLength = criteria.criteriaMaxLength
      ? criteria.criteriaMaxLength
      : 12;
    this.criteriaMinLength = criteria.criteriaMinLength
      ? criteria.criteriaMinLength
      : 1;
  }
}
