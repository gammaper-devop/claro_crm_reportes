import { User } from '@shell/app/core';
import { ErrorResponse } from '../interfaces';
import { Person } from './person.model';

export interface BiometricResponse {
  bestFootPrint: {
    idFootPrintLeft: string;
    footPrintDescriptionLeft: string;
    idFootPrintRight: string;
    footPrintDescriptionRight: string;
    idBioParent: string;
  };
  configuration: BiometricConfig;
}

export interface BiometricBody {
  person: Person;
  errorSale: ErrorResponse;
  scanBiometric: boolean;
  flagBio: boolean;
  saleSuccess?: boolean;
  user: User;
  secNumber?: string;
  saleOperationType?: string;
  noBiometricAttempts?: number;
  limitBiometricAttempts: number;
  lines?: any;
  omissionRequired?: boolean;
  orderNumber: string;
}

export interface BiometricConfig {
  operationType?: string;
  operationDescription?: string;
  biometricFlag?: boolean;
  footprintFlag?: boolean;
  inabilityFlag?: boolean;
  noBiometricFlag?: boolean;
  noBiometricMaxAttemptsNumber?: number;
  inabilityButton?: string;
  inabilityMessage?: string;
  omissionFlag?: boolean;
  omissionButton?: string;
  omissionConfirm?: string;
  lastAttemptMessage?: string;
  verificationBiometricType: string;
}

export class Biometric {
  bestFingerpintLeft: {
    value: string;
    label: string;
  };
  bestFingerpintRight: {
    value: string;
    label: string;
  };
  parent: string;
  fingerprintImage: string;
  fingerprintValue: string;
  configuration: BiometricConfig;

  constructor(biometric: BiometricResponse) {
    if (biometric.bestFootPrint) {
      this.bestFingerpintLeft = {
        value: biometric.bestFootPrint.idFootPrintLeft,
        label: biometric.bestFootPrint.footPrintDescriptionLeft,
      };
      this.bestFingerpintRight = {
        value: biometric.bestFootPrint.idFootPrintRight,
        label: biometric.bestFootPrint.footPrintDescriptionRight,
      };
      this.parent = biometric.bestFootPrint.idBioParent || '';
    }
    this.fingerprintImage = '';
    this.fingerprintValue = '';
    this.configuration = biometric.configuration;
  }
}
