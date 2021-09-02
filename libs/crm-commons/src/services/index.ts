export * from './api.service';
export * from './biometric.service';
export * from './biometric-license.service';
export * from './pin.service';
export * from './generics.service';
export * from './error.service';

import { CRMApiService } from './api.service';
import { CRMBiometricService } from './biometric.service';
import { CRMBiometricLicenseService } from './biometric-license.service';
import { CRMPinService } from './pin.service';
import { CRMGenericsService } from './generics.service';
import { CRMErrorService } from './error.service';

export const Services = [
  CRMApiService,
  CRMBiometricService,
  CRMBiometricLicenseService,
  CRMPinService,
  CRMGenericsService,
  CRMErrorService,
];
