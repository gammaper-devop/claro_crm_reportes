export interface DeclarationKnowledgeResponse {
  idText: string;
  text: string;
  orderNumber: number;
  flagMandatory: boolean;
}

export class DeclarationKnowledge {
  value: string;
  label: string;
  orderNumber: number;
  flagMandatory: boolean;

  constructor(declaration: DeclarationKnowledgeResponse) {
    this.value = declaration.idText ? declaration.idText : '';
    this.label = declaration.text ? declaration.text : '';
    this.orderNumber = declaration.orderNumber ? declaration.orderNumber : 0;
    this.flagMandatory = declaration.flagMandatory ? declaration.flagMandatory : false;
  }
}
