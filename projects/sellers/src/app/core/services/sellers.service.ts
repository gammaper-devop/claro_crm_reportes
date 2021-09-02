import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  DocumentsSellers,
  DocumentsSellersResponse,
  IParameter,
  PortabilityParam,
  PortabilityParamResponse,
  Seller,
  SellerResponse,
} from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SellersService {
  constructor(private apiService: ApiService) {}

  postSellers(body: any): Promise<Seller[]> {
    return this.apiService
      .post(this.apiService.searchSellers, body)
      .pipe(
        map(response =>
          response.map((param: SellerResponse) => new Seller(param)),
        ),
      )
      .toPromise();
  }

  deleteSellers(body: any): Promise<Seller> {
    return this.apiService
      .patch(this.apiService.registerSellers, body)
      .toPromise();
  }

  getDocumentSellerParam(body?: any): Observable<DocumentsSellers[]> {
    return this.apiService
      .post(`${this.apiService.documentSearch}`, body)
      .pipe(
        map(response =>
          response.criterias.map(
            (documentSeller: DocumentsSellersResponse) =>
              new DocumentsSellers(documentSeller),
          ),
        ),
      );
  }

  getnetworkAccountTypes(body: any): Observable<IParameter[]> {
    return this.apiService.post(this.apiService.networkAccountTypes, body).pipe(
      map(res =>
        res.map(
          user =>
            ({
              value: user.userAccount,
              label: user.userAccount,
            } as IParameter),
        ),
      ),
    );
  }

  getPortabilityParam(
    cboKey: string,
    params?: any,
  ): Promise<PortabilityParam[]> {
    return this.apiService
      .get(`${this.apiService.portabilityParams}/${cboKey}`, params)
      .pipe(
        map(response =>
          response.map(
            (param: PortabilityParamResponse) => new PortabilityParam(param),
          ),
        ),
      )
      .toPromise();
  }

  getValidatePhone(body: any): Promise<{ success: boolean }> {
    return this.apiService
      .post(this.apiService.phoneValidate, body)
      .toPromise();
  }

  postRegisterSellers(body: any): Promise<{ success: boolean }> {
    return this.apiService
      .post(this.apiService.registerSellers, body)
      .toPromise();
  }

  putRegisterSellers(body: any): Promise<{ success: boolean }> {
    return this.apiService
      .put(this.apiService.registerSellers, body)
      .toPromise();
  }
}
