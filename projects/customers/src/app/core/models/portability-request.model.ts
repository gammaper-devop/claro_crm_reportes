export interface PortabilityRequestResponse {
  mensajeGeneral: string;
  codeResponse: string;
  phoneNumbers: PhoneNumberResponse[];
}

export class PortabilityRequest {
  messageGeneral: string;
  codeResponse: string;
  phoneNumbers: PhoneNumber[];

  constructor(portabilityRequest: PortabilityRequestResponse) {
    this.messageGeneral = portabilityRequest.mensajeGeneral ? portabilityRequest.mensajeGeneral : '';
    this.codeResponse = portabilityRequest.codeResponse ? portabilityRequest.codeResponse : '';
    if (portabilityRequest.phoneNumbers && portabilityRequest.phoneNumbers.length > 0) {
      this.phoneNumbers = portabilityRequest.phoneNumbers.map((numbers: PhoneNumberResponse) => new PhoneNumber(numbers));
    }
  }
}

export interface PhoneNumberResponse {
  phoneNumber: string;
  message: string;
  type: string;
  motive: string;
  days: string;
}

export class PhoneNumber {
  phoneNumber: string;
  message: string;
  type: string;
  motive: string;
  days: string;

  constructor(phoneNumber: PhoneNumberResponse) {
    this.phoneNumber = phoneNumber.phoneNumber ? phoneNumber.phoneNumber : '';
    this.message = phoneNumber.message ? phoneNumber.message : '';
    this.type = phoneNumber.type ? phoneNumber.type : '';
    this.motive = phoneNumber.motive ? phoneNumber.motive : '';
    this.days = phoneNumber.days ? phoneNumber.days : '';
  }
}
