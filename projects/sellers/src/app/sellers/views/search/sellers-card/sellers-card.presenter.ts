import { Injectable } from '@angular/core';
import { Seller, SellersService } from '@sellers/app/core';
import { ErrorResponse, CRMErrorService } from '@claro/crm/commons';
import { AuthService, User } from '@shell/app/core';
import { ESellerDocument } from '@sellers/app/core';

@Injectable()
export class SellersCardPresenter {
  error: ErrorResponse;
  sellersResp: any;
  user: User;

  constructor(
    private sellersService: SellersService,
    private authService: AuthService,
    private errorService: CRMErrorService,
  ) {
    this.user = this.authService.getUser();
  }

  async postSellers(docType, docNum): Promise<Seller> {
    const searchType = docType === ESellerDocument.NAC ? 2 : 1;
    this.error = null;
    const body = {
      documentType: docType,
      documentNumber: docNum,
      accountNet: this.user.account,
      searchType: searchType,
    };
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
