import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProgressbarService } from '@claro/commons';
import { EventBus } from '@claro/commons/event-bus';
import {
  Biometric,
  Channels,
  CRMBiometricService,
  CRMPinService,
  DocumentType,
  ErrorResponse,
  CRMGenericsService,
  MicroAppConfigService,
  EErrorType,
  ErrorCodes,
  Pin,
} from '@claro/crm/commons';
import { EChannel, User } from '@shell/app/core';
import { LoginService, ELoginStep } from '@login/app/core';

@Injectable()
export class LoginPresenter {
  user: User;
  documentTypes$: Observable<DocumentType[]>;
  loginStep = ELoginStep;
  currentStep = ELoginStep.account;
  error: ErrorResponse;
  biometric: Biometric;
  scanStatus: boolean;
  biometricAttemptsNumber = 0;
  pinStatus: boolean;
  pinAttemptsNumber = 0;
  pinValidationsNumber = 0;
  maxValidations = false;
  pin: Pin;

  constructor(
    private eventBus: EventBus,
    private config: MicroAppConfigService,
    private progressbarService: ProgressbarService,
    private genericsService: CRMGenericsService,
    private biometricService: CRMBiometricService,
    private pinService: CRMPinService,
    private loginService: LoginService,
  ) {
    this.documentTypes$ = this.genericsService.getUserDocuments('PAG_LOG').pipe(
      catchError(error => {
        this.showError(error, 'CRM-902');
        return throwError(error);
      }),
    );
  }

  async submitAccount(body: any) {
    this.error = null;
    try {
      body.userAccount = body.userAccount.toUpperCase();
      this.user = await this.loginService.validateAccount(body);
      if (!this.user.configurations || !this.user.configurations.length) {
        this.showFunctionalError('CRM-914');
      } else {
        if (this.user.channel === EChannel.DAC) {
          this.currentStep = this.loginStep.identification;
        } else {
          this.validateDashboard();
        }
      }
    } catch (error) {
      this.showError(error, 'CRM-901');
    }
  }

  async submitIdentification(body: any) {
    this.error = null;
    try {
      this.user = await this.loginService.validateIdentification(
        this.user,
        body,
      );
      this.validateTwoFactor();
    } catch (error) {
      this.showError(error, 'CRM-903');
    }
  }

  async getBestFingerprint() {
    try {
      const verificationTypeConfig = this.user.configurations.find(
        config => config.key === 'loginVerificationType',
      );
      this.biometric = await this.biometricService.getBestFingerprint({
        userAccount: this.user.account,
        channelCode: this.user.channel,
        documentType: this.user.documentType,
        documentNumber: this.user.documentNumber,
        verificationType: verificationTypeConfig?.value || 2,
      });
      this.currentStep = this.loginStep.biometric;
    } catch (error) {
      this.showError(error, 'CRM-904');
    }
  }

  async scanBiometric() {
    this.error = null;
    this.scanStatus = null;
    try {
      if (this.biometricAttemptsNumber < this.user.biometricAttemptsNumber) {
        this.scanStatus = await this.biometricService.scanFingerprint(
          this.biometric,
          this.config.biometric,
        );
      } else {
        if (this.user.flagPin) {
          this.currentStep = this.loginStep.pin;
          await this.sendPin();
        } else {
          this.showFunctionalError('CRM-907');
        }
      }
    } catch (error) {
      this.scanStatus = false;
      this.showFunctionalError(error || 'CRM-905', false);
      this.showError(this.error);
    }
  }

  async submitBiometric(body: any) {
    this.error = null;
    try {
      this.biometricAttemptsNumber++;
      await this.biometricService.validateFingerprint(body);
      // this.currentStep = this.loginStep.success;
      this.login();
    } catch (error) {
      this.scanStatus = false;
      this.showError(error, 'CRM-908');
    }
  }

  async sendPin() {
    this.error = null;
    this.pinStatus = null;
    this.pinValidationsNumber = 0;
    this.maxValidations = false;
    try {
      if (!this.pin || this.pinAttemptsNumber < this.pin.numberAttempts) {
        this.pinAttemptsNumber++;
        const pin = await this.pinService.sendPin({
          phoneNumber: this.user.phone,
          documentNumber: this.user.documentNumber,
          userAccount: this.user.account,
          operationType: 'LOG',
          flagSMSIndico: '0',
        });
        if (!this.pin) {
          this.pin = pin;
        } else {
          this.pin.sendSMSPin = pin.sendSMSPin;
        }
        this.pinStatus = true;
        if (this.currentStep !== this.loginStep.pin) {
          this.currentStep = this.loginStep.pin;
        }
      } else {
        this.showFunctionalError('CRM-910');
      }
    } catch (error) {
      this.showError(error, 'CRM-909');
      if (this.error.code === 'IDFF1') {
        this.showFunctionalError('CRM-910');
      }
    }
  }

  async submitPin(body: any) {
    this.error = null;
    try {
      if (this.pinValidationsNumber < this.pin.retriesNumber) {
        this.pinValidationsNumber++;
        await this.pinService.validatePin(body);
        // this.currentStep = this.loginStep.success;
        this.login();
      } else {
        this.maxValidations = true;
        this.showFunctionalError('CRM-913', false);
      }
    } catch (error) {
      this.showError(error, 'CRM-911');
      if (this.error.code === 'IDFF5') {
        this.maxValidations = true;
      }
    }
  }

  async validateTwoFactor() {
    if (this.user.flagBiometric) {
      await this.getBestFingerprint();
    } else if (this.user.flagPin) {
      await this.sendPin();
    } else {
      this.validateDashboard();
    }
  }

  private validateDashboard() {
    const dashboardConfig = this.user.configurations.find(
      config => config.key === 'dashboard' + Channels[this.user.channel],
    );
    if (dashboardConfig?.value === '1') {
      // this.currentStep = this.loginStep.success;
      this.login();
    } else {
      this.showFunctionalError('CRM-912');
    }
  }

  async login() {
    try {
      this.progressbarService.show();
      setTimeout(() => {
        this.progressbarService.hide();
        this.eventBus.$emit('loginSuccess', this.user);
      }, 2000);
    } catch (error) {
      this.showError(error, 'CRM-960');
    }
  }

  showFunctionalError(code: string, showErrorPage = true) {
    this.error = {
      code,
      description: ErrorCodes[code] || code,
      errorType: EErrorType.Functional,
    };
    if (showErrorPage) {
      this.currentStep = this.loginStep.error;
    }
  }

  showError(error: ErrorResponse, code?: string) {
    if (error.errorType === EErrorType.Functional) {
      this.error = error;
    } else {
      if (code) {
        error.code = code;
      }
      this.error = error;
      this.currentStep = this.loginStep.error;
    }
  }
}
