import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MemoryStorage } from '@claro/commons/storage';
import {
  DocumentType,
  ErrorCodes,
  ErrorResponse,
  Generics,
  CRMGenericsService,
  SnackbarService,
  EErrorType,
  CRMErrorService,
} from '@claro/crm/commons';
import {
  Customer,
  CustomerService,
  District,
  Province,
} from '@customers/app/core';
@Injectable()
export class RegisterPresenter {
  responseMessage: any;
  error: ErrorResponse;
  customer: Customer;
  documentTypes$: Observable<DocumentType[]>;
  generics: Generics[];
  nationalities: Generics[];
  maritalStatus: Generics[];
  genders: Generics[];
  provinces: Province[];
  districts$: Observable<District[]>;
  showPageError = false;

  constructor(
    private router: Router,
    private memory: MemoryStorage,
    public snackbarService: SnackbarService,
    private customerService: CustomerService,
    private genericsService: CRMGenericsService,
    private errorService: CRMErrorService,
  ) {
    this.documentTypes$ = this.genericsService.getUserDocuments('PAG_CLI').pipe(
      catchError(error => {
        this.error = this.errorService.showError(
          error,
          'CRM-902',
        );
        this.showPageError = true;
        return throwError(error);
      }),
    );
   
  }

  async getGenerics() {
    this.generics = await this.genericsService
      .getGenerics('CBO_ALL')
      .pipe(
        catchError(error => {
          this.error = this.errorService.showError(
            error,
            'CRM-930',
          );
          this.showPageError = true;
          return throwError(error);
        }),
      )
      .toPromise();
      this.nationalities = this.generics.filter(
        generic => generic.cboKey === 'CBO_NATIONALITY',
      );
      this.maritalStatus = this.generics.filter(
        generic => generic.cboKey === 'CBO_CIVIL_STATUS',
      );
      this.genders = this.generics.filter(
        generic => generic.cboKey === 'CBO_GENDER',
      );
  }

  goBack() {
    this.router.navigate(['/clientes/busqueda']);
  }

  async sendCustomer(newCustomer: any) {
    this.error = null;
    try {
      this.customer = await this.customerService.postCustomerAdd(newCustomer);
      this.memory.set('newCustomer', true);
      this.memory.remove('payments');
      this.router.navigate(['/clientes/perfil']);
    } catch (error) {
      this.error = error;
      if (this.error.errorType === EErrorType.Technical) {
        this.error.description = ErrorCodes['CRM-936'];
      }
      this.snackbarService.show(this.error.description, 'error');
    }
  }
}
