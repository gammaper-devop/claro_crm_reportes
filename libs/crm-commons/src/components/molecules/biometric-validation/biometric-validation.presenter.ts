import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorCodes } from '../../../global';
import {
  CRMBiometricService,
  CRMBiometricLicenseService,
  CRMGenericsService,
  CRMErrorService,
} from 'libs/crm-commons/src/services';
import { MicroAppConfigService } from 'libs/crm-commons/src/microapp-loader';
import {
  Biometric,
  Person,
  Office,
  SecurityQuestion,
  SecurityQuestionService,
  BiometricBody,
  BiometricConfig,
} from '../../../models';
import { ErrorResponse } from 'libs/crm-commons/src/interfaces';
import { EErrorType } from 'libs/crm-commons/src/enums';

@Injectable()
export class BiometricValidationPresenter {
  error: ErrorResponse;
  errorBiometric: ErrorResponse; 
  questions: SecurityQuestion[];
  successfulBiometric: boolean;
  office: Office;
  noMoreAttempts: boolean;
  isScanning: boolean;
  islicensing: boolean;
  biometric: Biometric;
  nonbiometricAttemptsNumber: number;
  newPerson: any;
  initBiometricAttempts = 0;
  questionsError = false;
  request: any;
  biometricLinceseResponse = false;

  constructor(
    private biometricService: CRMBiometricService,
    private biometricLicenseService: CRMBiometricLicenseService,
    private errorService: CRMErrorService,
    private genericsService: CRMGenericsService,
    private config: MicroAppConfigService,
  ) {
    this.init();
    this.office = this.genericsService.getOfficeDetail();
  }

  init() {
    this.successfulBiometric = false;
    this.noMoreAttempts = false;
    this.nonbiometricAttemptsNumber = 0;
  }

  async getQuestions(body: BiometricBody) {
    const { channel, account } = body.user;
    const { documentNumber } = body.person;
    this.error = null;
    this.questionsError = false;
    this.questions = await this.biometricService
      .getQuestions({
        channelCode: channel,
        account,
        documentNumber,
      })
      .pipe(
        catchError(error => {
          this.questionsError = true;
          this.error = this.errorService.showError(error, 'CRM-007', false);
          return throwError(error);
        }),
      )
      .toPromise();
  }

  async submitNonBiometric(
    body: BiometricBody,
    answers: SecurityQuestionService[],
    numberAttempts: number,
  ): Promise<Person> {
    this.error = null;
    try {
      const { account } = body.user;
      const { documentNumber } = body.person;
      const newPerson = await this.biometricService.validateSecurityQuestions({
        officeSale: this.office.officeCode,
        documentNumber,
        account,
        operationType: body.saleOperationType || '01',
        idFatherBio: this.biometric.parent || '',
        numberAttempts,
        unblockFlagManual: body.lines?.unblockFlagManual,
        listAnswers: answers,
      });
      this.newPerson = newPerson;
      if (newPerson) {
        this.biometricService.update(body.person, this.newPerson);
      }
      this.successfulBiometric = true;
      return newPerson as Person;
    } catch (error) {
      this.successfulBiometric = false;
      this.error = this.errorService.showError(error, 'CRM-008');
      return null;
    }
  }

  async getBestFingerprint(
    body: BiometricBody,
    biometricConfig: BiometricConfig,
  ) {
    this.errorBiometric = null;
    this.questionsError = false;
    try {
      if (!this.biometric) {
        this.biometric = await this.biometricService.getBestFingerprint({
          userAccount: body.user.account,
          channelCode: body.user.channel,
          documentType: '01',
          documentNumber: body.person.documentNumber,
          verificationType: biometricConfig?.verificationBiometricType || '2',
          orderNumber: body.orderNumber
        });
      }
    } catch (error) {
      this.questionsError = true;
      this.errorBiometric = this.errorService.showError(error, 'CRM-904');
    }
  }

  async scanFingers(body: BiometricBody, biometricConfig: BiometricConfig, biometricType: string) {
    this.errorBiometric = null;
    let newPerson = null;
    try {
      if (this.initBiometricAttempts < body.limitBiometricAttempts) {
        this.isScanning = true;
        await this.biometricService.scanFingerprint(
          this.biometric,
          this.config.biometric,
        );
        this.initBiometricAttempts++;
        if (biometricType === 'sellers') {
          this.request = {
            userAccount: body.user.account,
            channelCode: body.user.channel,
            documentType: '01',
            documentNumber: body.person.documentNumber,
            officeSale: this.office.officeCode,
            secNumber: body.secNumber || '0',
            footPrintImage: this.biometric.fingerprintImage,
            templateFootPrint: this.biometric.fingerprintValue,
            validationType: 'C',
            validationVerification: '1',
            idBioParent: this.biometric.parent,
            operationType: 'LO',
            actionType: 'A',
          };
        } else {
          this.request = {
            userAccount: body.user.account,
            channelCode: body.user.channel,
            documentType: '01',
            documentNumber: body.person.documentNumber,
            officeSale: this.office.officeCode,
            secNumber: body.secNumber || '0',
            footPrintImage: this.biometric.fingerprintImage,
            templateFootPrint: this.biometric.fingerprintValue,
            validationType: 'C',
            validationVerification:
              biometricConfig?.verificationBiometricType || '2',
            idBioParent: this.biometric.parent,
            operationType: body.saleOperationType,
            actionType: 'V',
          };
        }
        newPerson = await this.submitBiometric(this.request);
        this.newPerson = newPerson;
        if (newPerson) {
          this.biometricService.update(body.person, this.newPerson);
        }
      } else {
        this.noMoreAttempts = true;
        this.errorBiometric = {
          code: 'CRM-977',
          title: '¡Biometría Fallida!',
          description: ErrorCodes['CRM-977'],
          errorType: EErrorType.Functional,
        } as ErrorResponse;
      }
      return !!newPerson;
    } catch (error) {
      if (!error || typeof error === 'string') {
        switch (error) {
          case '19002':
            error = {
              code: '19002',
              description: ErrorCodes['19002'],
              errorType: EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
          case '19003':
            error = {
              code: '19003',
              description: ErrorCodes['19003'],
              errorType: EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
          case '19006':
            error = {
              code: '19006',
              description: ErrorCodes['19006'],
              errorType: EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
          case '19014':
            error = {
              code: '19014',
              description: ErrorCodes['19014'],
              errorType: EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
          case '19015':
            error = {
              code: '19015',
              description: ErrorCodes['19015'],
              errorType: EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
          case '19017':
            error = {
              code: '19017',
              description: ErrorCodes['19017'],
              errorType: EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
          case '19034':
            error = {
              code: '19034',
              description: ErrorCodes['19034'],
              errorType: EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
          case '19035':
            error = {
              code: '19035',
              description: ErrorCodes['19035'],
              errorType: EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
          case '19036':
            error = {
              code: '19036',
              description: ErrorCodes['19036'],
              errorType: EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
          default:
            error = {
              code: 'CRM-905',
              description: ErrorCodes['CRM-905'],
              errorType: error || EErrorType.Functional,
            } as ErrorResponse;
            this.errorBiometric = this.errorService.showError(error);
            break;
        }
      } else {
        this.errorBiometric = this.errorService.showError(error, 'CRM-908');
      }
    } finally {
      this.isScanning = false;
    }
  }

  async submitBiometric(body: any): Promise<any> {
    this.errorBiometric = null;
    try {
      const person = await this.biometricService.validateFingerprint(body);
      this.successfulBiometric = true;
      return person as Person;
    } catch (error) {
      this.successfulBiometric = false;
      this.errorBiometric = this.errorService.showError(error, 'CRM-908');
      return null;
    }
  }

  async getLinceseBiometric(body: BiometricBody, biometricConfig: BiometricConfig) {
    this.errorBiometric = null;
    try {
      if (!this.biometricLinceseResponse) {
        this.islicensing = true;
        const request = {
          userAccount: body.user.account,
          username: body.user.configurations.find(config => config.key === 'biometricsUserBiomatch')?.value,
          password: body.user.configurations.find(config => config.key === 'biometricsSegBiomatch')?.value,
        };
        this.biometricLinceseResponse = await this.biometricLicenseService.getLinceseBiometric(
          request,
          this.config.biometric,
        );
      }
    } catch (error) {
      switch (error) {
        case '19002':
          error = {
            code: '19002',
            description: ErrorCodes['19002'],
            errorType: EErrorType.Functional,
          } as ErrorResponse;
          this.errorBiometric = this.errorService.showError(error);
          break;
        case '19003':
          error = {
            code: '19003',
            description: ErrorCodes['19003'],
            errorType: EErrorType.Functional,
          } as ErrorResponse;
          this.errorBiometric = this.errorService.showError(error);
          break;
        case '19006':
          error = {
            code: '19006',
            description: ErrorCodes['19006'],
            errorType: EErrorType.Functional,
          } as ErrorResponse;
          this.errorBiometric = this.errorService.showError(error);
          break;
        case '19014':
          error = {
            code: '19014',
            description: ErrorCodes['19014'],
            errorType: EErrorType.Functional,
          } as ErrorResponse;
          this.errorBiometric = this.errorService.showError(error);
          break;
        case '19015':
          error = {
            code: '19015',
            description: ErrorCodes['19015'],
            errorType: EErrorType.Functional,
          } as ErrorResponse;
          this.errorBiometric = this.errorService.showError(error);
          break;
        case '19017':
          error = {
            code: '19017',
            description: ErrorCodes['19017'],
            errorType: EErrorType.Functional,
          } as ErrorResponse;
          this.errorBiometric = this.errorService.showError(error);
          break;
        case '19034':
          error = {
            code: '19034',
            description: ErrorCodes['19034'],
            errorType: EErrorType.Functional,
          } as ErrorResponse;
          this.errorBiometric = this.errorService.showError(error);
          break;
        case '19035':
          error = {
            code: '19035',
            description: ErrorCodes['19035'],
            errorType: EErrorType.Functional,
          } as ErrorResponse;
          this.errorBiometric = this.errorService.showError(error);
          break;
        case '19036':
          error = {
            code: '19036',
            description: ErrorCodes['19036'],
            errorType: EErrorType.Functional,
          } as ErrorResponse;
          this.errorBiometric = this.errorService.showError(error);
          break;
      }
      return false;
    }finally{
      this.islicensing = false;
    }
    return this.biometricLinceseResponse;
  }
}
