import { Injectable } from '@angular/core';

import { MemoryStorage } from '@claro/commons/storage';
import { ErrorResponse, CRMErrorService } from '@claro/crm/commons';
import { AuthService, User } from '@shell/app/core';
import {
  Customer,
  CustomerService,
  ProfileService,
  PaymentPending,
} from '@customers/app/core';

@Injectable()
export class ProfilePresenter {
  user: User;
  customer: Customer;
  payments: PaymentPending[];
  error: ErrorResponse;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private memory: MemoryStorage,
    private profileService: ProfileService,
    private errorService: CRMErrorService,
  ) {
    this.user = this.authService.getUser();
    this.customer = this.customerService.getCustomer();
  }

  async getPayments() {
    const { documentNumber, documentTypeCode } = this.customer;
    const body = {
      documentNumber,
      documentType: documentTypeCode,
      officeCode: this.user.office,
      interlocutorCode: '',
      date: '',
      pickingActive: '',
    };
    this.error = null;
    try {
      this.payments = await this.profileService.getPayments(body);
      this.memory.set('payments', this.payments);
    } catch (error) {
      this.payments = [];
      this.error = this.errorService.showError(
        error,
        'CRM-920',
      );
    }
  }
}
