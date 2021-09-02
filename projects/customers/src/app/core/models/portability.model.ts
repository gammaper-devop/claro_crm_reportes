export interface PortabilityParamResponse {
  parameterCode: string;
  description: string;
  keyCombo: string;
  paramRequired: string;
}

export class PortabilityParam {
  value: string;
  label: string;
  cboKey: string;
  paramRequired: string;

  constructor(generics: PortabilityParamResponse) {
    this.value = generics.parameterCode ? generics.parameterCode : '';
    this.label = generics.description ? generics.description : '';
    this.cboKey = generics.keyCombo ? generics.keyCombo : '';
    this.paramRequired = generics.paramRequired ? generics.paramRequired : '';
  }
}
