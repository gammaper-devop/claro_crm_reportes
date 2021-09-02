import { Injectable } from '@angular/core';
import { DocumentsSellers, Seller, SellersService } from '@sellers/app/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CRMErrorService, ErrorResponse } from '@claro/crm/commons';
import { AuthService, User } from '@shell/app/core';
import { ESellerDocument } from '@sellers/app/core';
import { IParameter } from '@contracts/app/core';

@Injectable()
export class SearchBarPresenter {
  error: ErrorResponse;
  options$: Observable<IParameter[]>;
  options: DocumentsSellers[];
  sellersResp: Seller[];
  user: User;

  constructor(
    private sellersService: SellersService,
    private authService: AuthService,
    private errorService: CRMErrorService,
  ) {
    this.user = this.authService.getUser();
    // this.getDocuments();
  }

  async getDocuments() {
    const body = {
      channel: this.user?.channel,
      office: this.user?.office,
      flagCensus: true
    };
    try {
      this.options = await this.sellersService.getDocumentSellerParam(body)
      .toPromise();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-005', true);
      return throwError(error);
    }
  }

  async postSellers(docType: string, docNum: string): Promise<Seller[]> {
    const optionSelected = this.options.find(
      element => element.value === docType
    );
    this.error = null;
    let body = {};
    if (optionSelected.criteriaId === '2') {
      body = {
        documentType: '',
        documentNumber: '',
        accountNet: docNum,
        searchType: optionSelected.criteriaId,
      };
    } else {
      body = {
        documentType: docType,
        documentNumber: docNum,
        accountNet: '',
        searchType: optionSelected.criteriaId,
      };
    }
    try {
      this.sellersResp = await this.sellersService.postSellers(body);
      return this.sellersResp;
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-004',
        true,
      );
      return error;
    }
  }
}
