import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UTILS } from '@claro/commons';
import {
  CRMPinService,
  EErrorType,
  ErrorCodes,
  ErrorResponse,
  Pin,
  CRMErrorService,
} from '@claro/crm/commons';
import { User } from '@shell/app/core';
import { Customer, PortabilityService } from '@customers/app/core';

@Injectable()
export class AddLinePresenter {
  error: ErrorResponse;
  pinAttemptsNumber = 0;
  maxAttempts = false;
  pinValidationsNumber = 0;
  maxValidations = false;
  pin: Pin;
  progressbarValue = 1;
  progressbarIncrement = 0;
  attempts = 1;
  timeout = null;
  interval = null;
  priorConsultationAttemptsNumber = 3;
  priorConsultationWaitTime = 5;

  constructor(
    private portabilityService: PortabilityService,
    private pinService: CRMPinService,
    private errorService: CRMErrorService,
  ) {}

  calculateRetryPercentage(user: User) {
    const attemptsNumberConfig = user.configurations.find(
      config => config.key === 'priorConsultationAttemptsNumber',
    );
    if (attemptsNumberConfig) {
      this.priorConsultationAttemptsNumber = Number(attemptsNumberConfig.value);
    }
    const waitTimeConfig = user.configurations.find(
      config => config.key === 'priorConsultationWaitTime',
    );
    if (waitTimeConfig) {
      this.priorConsultationWaitTime = Number(waitTimeConfig.value);
    }
    this.progressbarIncrement =
      100 /
      (this.priorConsultationAttemptsNumber + 1) /
      this.priorConsultationWaitTime;
  }

  async getCboServices() {
    try {
      return await this.portabilityService.getPortabilityParam('CBO_SERVICES');
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-950',
      );
    }
  }

  async getCboOperators(idService: string) {
    const body = {
      idService: idService,
    };
    try {
      return await this.portabilityService.getPortabilityParam(
        'CBO_OPERATOR',
        body,
      );
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-951',
      );
    }
  }

  async getCboModOrigins() {
    try {
      return await this.portabilityService.getPortabilityParam(
        'CBO_MOD_ORIGIN',
      );
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-952',
      );
    }
  }

  async PortabilityValidate(
    user: User,
    customer: Customer,
    saleOperationType: string,
    phoneNumber: string,
  ): Promise<boolean> {
    const body = {
      typeSale: '02',
      operationType: saleOperationType,
      documentType: customer.documentTypeCode,
      documentNumber: customer.documentNumber,
      channelCode: user.channel,
      validationType: '0',
      userAccount: user.account,
      phoneNumberList: [{ phoneNumber: phoneNumber }],
    };
    this.error = null;
    try {
      await this.portabilityService.postPortabilityValidate(body);
      return true;
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-954',
      );
      return false;
    }
  }

  async sendPIN(user: User, customer: Customer, phoneNumber: string) {
    this.error = null;
    try {
      if (!this.pin || this.pinAttemptsNumber < this.pin.numberAttempts) {
        this.pinAttemptsNumber++;
        const pin = await this.pinService.sendPin({
          phoneNumber: phoneNumber,
          documentNumber: customer.documentNumber,
          userAccount: user.account,
          operationType: 'POR',
          flagSMSIndico: '0',
        });
        if (!this.pin) {
          this.pin = pin;
        } else {
          this.pin.sendSMSPin = pin.sendSMSPin;
        }
        return true;
      } else {
        this.maxAttempts = true;
        this.error = this.errorService.showFunctionalError('CRM-910');
        return false;
      }
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-909',
      );
      if (this.error.code === 'IDFF1') {
        this.maxAttempts = true;
      }
      return false;
    }
  }

  async validatePIN(user: User, pin: string) {
    this.error = null;
    try {
      if (this.pinValidationsNumber < this.pin.retriesNumber) {
        this.pinValidationsNumber++;
        await this.pinService.validatePin({
          sendSMSPin: this.pin.sendSMSPin,
          phoneNumberCode: pin,
          userAccount: user.account,
        });
        return true;
      } else {
        this.maxValidations = true;
        this.error = this.errorService.showFunctionalError('CRM-913');
        return false;
      }
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-911',
      );
      if (this.error.code === 'IDFF5') {
        this.maxValidations = true;
      }
      return false;
    }
  }

  async priorConsultation(
    user: User,
    customer: Customer,
    form: FormGroup,
    phoneNumber: string,
  ) {
    this.error = null;
    this.attempts = 1;
    this.progressbarValue = 1;
    let response = null;
    try {
      response = await this.registerPriorConsultation(
        user,
        customer,
        form,
        phoneNumber,
      );
      this.error = {
        code: 'CRM-958',
        title: 'Validando',
        description: 'Pendiente de mensaje del ABDCP.',
        errorType: EErrorType.Functional,
      };
      this.timeout = setTimeout(() => {
        this.getPriorConsultation(response, form);
      }, this.priorConsultationWaitTime * 1000);
      this.interval = setInterval(() => {
        this.progressbarValue += this.progressbarIncrement;
      }, 1000);
    } catch (error) {
      if (error.errorType === EErrorType.Functional) {
        error.title = 'Rechazado';
      }
      this.error = this.errorService.showError(
        error,
        'CRM-955',
      );
    }
  }

  private async registerPriorConsultation(
    user: User,
    customer: Customer,
    form: FormGroup,
    phoneNumber: string,
  ) {
    try {
      return await this.portabilityService.registerPriorConsultation({
        userAccount: user.account,
        serviceCode: form.value.cboService.value,
        operatorCode: form.value.cboOperator.value,
        modalityCode: form.value.cboModOrigin.value,
        phoneNumber,
        documentType: customer.documentTypeCode,
        documentNumber: customer.documentNumber,
      });
    } catch (error) {
      throw error;
    }
  }

  private async getPriorConsultation(response, form: FormGroup) {
    try {
      const body = {
        ...response,
        ...{ productType: form.value.cboService.value },
      };
      const results = await this.portabilityService.getPriorConsultation(body);
      this.error = null;
      clearTimeout(this.timeout);
      clearInterval(this.interval);
      this.progressbarValue = 100;
      form.get('saleOptions').setValue(results.saleOptions);
      form.get('sequentialCode').setValue(response.secuentailCode);
      form.get('ready').setValue(true);
      if (results.dueFlag) {
        form.get('due').setValue(results.reasonDescription);
      }
      if (results.activationDate) {
        form
          .get('activationDate')
          .setValue(UTILS.formatDate(results.activationDate));
      }
      return true;
    } catch (error) {
      if (error.errorType === EErrorType.Functional) {
        if (!error.description) {
          if (this.attempts < this.priorConsultationAttemptsNumber) {
            this.timeout = setTimeout(() => {
              this.attempts++;
              this.getPriorConsultation(response, form);
            }, this.priorConsultationWaitTime * 1000);
          } else {
            clearTimeout(this.timeout);
            clearInterval(this.interval);
            this.progressbarValue = 100;
            this.error = {
              code: 'CRM-958',
              title: 'Rechazado',
              description: ErrorCodes['CRM-958'],
              errorType: EErrorType.Functional,
            };
          }
        } else {
          clearTimeout(this.timeout);
          clearInterval(this.interval);
          this.progressbarValue = 100;
          this.error = error;
        }
      }
    }
  }
}
