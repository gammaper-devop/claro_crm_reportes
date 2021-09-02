export interface PortabilityParamResponse {
  parameterCode: string;
  description: string;
  keyCombo: string;
  paramRequired?: string;
}

export class PortabilityParam {
  value: string;
  label: string;
  cboKey: string;
  paramRequired: string;

  constructor(generics: PortabilityParamResponse) {
    this.value = generics.parameterCode || '';
    this.label = generics.description || '';
    this.cboKey = generics.keyCombo || '';
    this.paramRequired = generics.paramRequired || '';
  }
}
