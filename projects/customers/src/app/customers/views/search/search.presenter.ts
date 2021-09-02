import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorResponse, EErrorType } from '@claro/crm/commons';
import {
  Customer,
  IParameter,
  SearchService,
  CustomerService,
} from '@customers/app/core';
import { AuthService, User } from '@shell/app/core';

@Injectable()
export class SearchPresenter {
  customers: Customer[];
  options$: Observable<IParameter[]>;
  error: ErrorResponse;
  responseError = false;
  user: User;

  constructor(
    private customerService: CustomerService,
    private searchService: SearchService,
    private authService: AuthService,
  ) {
    this.getDocuments();
  }

  async getDocuments() {
    this.user = await this.authService.getUser();
    const body = {
      channel: this.user.channel,
      office: this.user.office,
      flagCensus: false
    };
    this.options$ = this.searchService
      .getList(body)
      .pipe(
        catchError(error => {
          this.responseError = true;
          return throwError(error);
        }),
      );
  }

  async postSearch(body) {
    this.error = null;
    this.customers = undefined;
    try {
      const response = await this.searchService.postSearch(body);
      this.customers = response.clientList;
    } catch (error) {
      if (error.errorType === EErrorType.Functional) {
        this.customers = [];
      } else {
        this.error = error;
      }
    }
  }

  setCustomer(customer: Customer) {
    this.customerService.setCustomer(customer);
  }
}
