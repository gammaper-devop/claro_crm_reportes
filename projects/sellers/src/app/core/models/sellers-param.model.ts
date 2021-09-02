export interface SellersParamResponse {
  criterias: {
    criteriaId: string;
    documentTypeId: string;
    criteriaName: string;
    criteriaFormat: string;
    criteriaMaxLength: string;
    criteriaMinLength: string;
  }[];
}

export class SellersParam {
  criterias: {
    criteriaId: string;
    documentTypeId: string;
    criteriaName: string;
    criteriaFormat: string;
    criteriaMaxLength: string;
    criteriaMinLength: string;
  }[];
  sellers: boolean;

  constructor(sellers: SellersParamResponse) {
    if (sellers.criterias) {
      this.criterias = sellers.criterias.map(resp => ({
        criteriaId: resp.criteriaId || '',
        documentTypeId: resp.documentTypeId || '',
        criteriaName: resp.criteriaName || '',
        criteriaFormat: resp.criteriaFormat || '',
        criteriaMaxLength: resp.criteriaMaxLength || '',
        criteriaMinLength: resp.criteriaMinLength || '',
      }));
    }
  }
}
