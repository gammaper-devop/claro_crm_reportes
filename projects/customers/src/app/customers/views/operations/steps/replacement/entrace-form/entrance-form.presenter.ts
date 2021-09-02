import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ErrorResponse,
  Generics,
  CRMGenericsService,
  CRMErrorService,
} from '@claro/crm/commons';
import { User } from '@shell/app/core';
import { Customer, ReplacementService } from '@customers/app/core';

@Injectable()
export class EntranceFormPresenter {
  error: ErrorResponse;
  cboService$: Observable<Generics[]>;
  cboOperator$: Observable<Generics[]>;
  cboModOrigin$: Observable<Generics[]>;
  cboRepType$: Observable<Generics[]>;
  progressbarValue = 1;
  progressbarIncrement = 0;
  attempts = 1;
  timeout = null;
  interval = null;

  constructor(
    private replacementService: ReplacementService,
    private genericsService: CRMGenericsService,
    private errorService: CRMErrorService,
  ) {}

  async getCboServices() {
    try {
      return await this.replacementService.getPortabilityParam('CBO_SERVICES');
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-950',
        true,
      );
    }
  }

  async getCboModOrigins() {
    try {
      return await this.replacementService.getPortabilityParam(
        'CBO_MOD_ORIGIN',
      );
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-952',
        true,
      );
    }
  }

  getCboRepTypes() {
    try {
      return this.genericsService.getGenerics('CBO_REPO');
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-996',
        true,
      );
    }
  }

  async validateReplacementNumber(
    phoneNumber: string,
    user: User,
    customer: Customer,
    typeSelected: string,
  ): Promise<any> {
    this.error = null;
    const body = {
      phoneNumber: phoneNumber,
      type: typeSelected,
      documentType: customer.documentTypeCode,
      documentNumber: customer.documentNumber,
      userAccount: user.account,
      channel: user.channel,
    };
    try {
      return await this.replacementService.validatePhoneNumber(body);
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-997',
      );
      return null;
    }
  }
}
