export interface PortabilityParamResponse {
  parameterCode: string;
  description: string;
  keyCombo: string;
}

export class PortabilityParam {
  value: string;
  label: string;
  cboKey: string;

  constructor(generics: PortabilityParamResponse) {
    this.value = generics.parameterCode || '';
    this.label = generics.description || '';
    this.cboKey = generics.keyCombo || '';
  }
}

export class RegionParam {
  value: string;
  label: string;
  cboKey: string;

  constructor(generics: PortabilityParamResponse) {
    this.value = generics.parameterCode || '';
    this.label = generics.description || '';
    this.cboKey = generics.keyCombo || '';
  }
}
