import { Injectable } from '@angular/core';

import { Customer, CustomerService } from '@customers/app/core';

@Injectable()
export class OperationsPresenter {
  customer: Customer;

  constructor(private customerService: CustomerService) {
    this.customer = this.customerService.getCustomer();
  }
}
