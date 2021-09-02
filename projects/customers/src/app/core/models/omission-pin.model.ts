export interface OmissionPinResponse {
  title: string;
  causes: [];
}

export class OmissionPin {
  title: string;
  causes: [];

  officeSalecode: string;
  portabilityType: string;
  channel: string;
  typeDocument: string;

  constructor(omissionPinResponse: OmissionPinResponse) {
    this.title = omissionPinResponse.title || '';
    this.causes = omissionPinResponse.causes || [];
  }
}
