import { Injectable } from '@angular/core';

import { ErrorResponse, CRMErrorService } from '@claro/crm/commons';
import { PortabilityService } from '@customers/app/core';

@Injectable()
export class ValidatePortabilityPresenter {
  error: ErrorResponse;

  constructor(
    private portabilityService: PortabilityService,
    private errorService: CRMErrorService,
  ) {}

  async postPortabilityRequest(secNumber, orderNumber): Promise<any> {
    try {
      return await this.portabilityService.postPortabilityRequest({
        secNumber: secNumber,
        orderNumber: orderNumber,
      });
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-981',
      );
      return false;
    }
  }
}
