export interface GenericsResponse {
  parameterCode: string;
  description: string;
  keyCombo: string;
}

export class Generics {
  value: string;
  label: string;
  cboKey: string;

  constructor(generics: GenericsResponse) {
    this.value = generics.parameterCode ? generics.parameterCode : '';
    this.label = generics.description ? generics.description : '';
    this.cboKey = generics.keyCombo ? generics.keyCombo : '';
  }
}
