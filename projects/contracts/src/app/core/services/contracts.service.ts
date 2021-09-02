import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import {
  ContractPending,
  ContractPendingResponse,
  GenerateDocument,
  GenerateDocumentResponse,
} from '../models';
import { ApiService } from './api.service';
import { SessionStorage } from '@claro/commons/storage';
import { Customer, CustomerResponse } from '../models/customer.model';
import { ErrorResponse } from '@claro/crm/commons';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  stateCustomer = 'claro-customer';

  constructor(
    private apiService: ApiService,
    private session: SessionStorage,
  ) {}

  getContracts(body: any): Promise<ContractPending[]> {
    return this.apiService
      .post(this.apiService.pending, body)
      .pipe(
        map(response => {
          return response.map(
            (operation: ContractPendingResponse) =>
              new ContractPending(operation),
          );
        }),
      )
      .toPromise();
  }

  getPaid(body: any): Promise<ContractPending[]> {
    return this.apiService
      .post(this.apiService.paid, body)
      .pipe(
        map(response => {
          return response.map(
            (operation: ContractPendingResponse) =>
              new ContractPending(operation),
          );
        }),
      )
      .toPromise();
  }

  postPaymentRollback(body: any): Promise<{ success: string }> {
    return this.apiService
      .post(this.apiService.paymentRollback, body)
      .toPromise();
  }

  postContractRollback(body: any): Promise<{ success: string }> {
    return this.apiService
      .post(this.apiService.contractRollback, body)
      .toPromise();
  }

  getPaymentsSummary(body: any): Promise<any> {
    return this.apiService
      .post(this.apiService.paymentDetail, body)
      .pipe(
        map(response => {
          return response;
        }),
      )
      .toPromise();
  }

  postGenerateDocuments(body: any): Promise<GenerateDocumentResponse[]> {
    return this.apiService
      .post(this.apiService.generateDocuments, body)
      .pipe(
        map(response => {
          return response.map(
            (document: GenerateDocumentResponse) =>
              new GenerateDocument(document),
          );
        }),
      )
      .toPromise();
  }

  postSearchContracts(
    body: any,
  ): Promise<{
    clientList?: Customer[];
    error?: ErrorResponse;
  }> {
    return this.apiService
      .get(this.apiService.search, body)
      .pipe(
        map(response => {
          if (response.clientList) {
            response.clientList = response.clientList.map(
              (customer: CustomerResponse) => new Customer(customer),
            );
          }
          return response;
        }),
      )
      .toPromise();
  }

  setCustomer(customer: Customer): void {
    this.session.set(this.stateCustomer, customer);
  }

  getCustomer(): Customer {
    return this.session.get(this.stateCustomer);
  }
}
