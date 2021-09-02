export interface PinResponse {
  sendSMSPin: string;
  numberAttempts: number;
  retriesNumber: number;
  timerModalWindow: number;
  numberDigits: number;
}

export class Pin {
  sendSMSPin: string;
  numberAttempts: number;
  retriesNumber: number;
  timerModalWindow: number;
  numberDigits: number;

  constructor(pin: PinResponse) {
    this.sendSMSPin = pin.sendSMSPin || '';
    this.numberAttempts = pin.numberAttempts || 0;
    this.retriesNumber = pin.retriesNumber || 0;
    this.timerModalWindow = pin.timerModalWindow || 0;
    this.numberDigits = pin.numberDigits || 0;
  }
}
