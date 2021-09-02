import { Injectable } from '@angular/core';

import { ErrorCodes, CRMErrorService, ErrorResponse } from '@claro/crm/commons';
import { User } from '@shell/app/core';
import {
  Customer,
  IParameter,
  OperationsService,
  OperationType,
} from '@customers/app/core';
import { MatDialog } from '@angular/material/dialog';
import { MaxlinesComponent } from '../maxlines/maxlines.component';

@Injectable()
export class SelectOperationPresenter {
  operations: OperationType;
  options: IParameter[];
  error: ErrorResponse;

  constructor(
    private operationsService: OperationsService,
    public dialog: MatDialog,
    private errorService: CRMErrorService,
  ) {}

  async openDialog(value: any) {
    await this.dialog.open(MaxlinesComponent, {
      data: value,
    });
  }

  async getOperations(user: User, customer: Customer, newCustomer: boolean) {
    const body = {
      channelCode: user.channel,
      documentType: customer.documentTypeCode,
      documentNumber: customer.documentNumber,
      newCustomer: newCustomer ? '1' : '0',
      officeCode: user.office,
    };
    this.error = null;
    try {
      this.operations = await this.operationsService.getOperations(body);
      if (this.operations.warningMessage) {
        this.openDialog(this.operations.warningMessage);
      }
      this.options = this.operations.operations.map(
        payment =>
          ({
            value: payment.idOperationType,
            label: payment.operationName,
            icon: `operation-${payment.idOperationType}`,
            disabled: !payment.isEnabled,
          } as IParameter),
      );

      if (!newCustomer && this.options.some(option => option.disabled)) {
        const error = { description: ErrorCodes['CRM-941'] } as ErrorResponse;
        this.error = this.errorService.showError(error, 'CRM-941');
      }
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-940');
    }
  }
}
