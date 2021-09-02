import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { IParameter } from '@customers/app/core';
import { ISearchLines } from '../interfaces';
import { PortabilityParam, PortabilityParamResponse } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ReplacementService {
  motives: IParameter[];
  freeMotives: IParameter[];

  constructor(private apiService: ApiService) {}

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
        map((response: PortabilityParam[]) => {
          return response.filter(
            element =>
              cboKey !== 'CBO_MOD_ORIGIN' ||
              (cboKey === 'CBO_MOD_ORIGIN' && element.value !== '02'),
          );
        }),
      )
      .toPromise();
  }

  validatePhoneNumber(body: any): Promise<ISearchLines> {
    return this.apiService.post(this.apiService.searchlines, body).toPromise();
  }

  postExecutePayment(body: any): Promise<{ success: string }> {
    return this.apiService
      .post(this.apiService.executePayment, body)
      .toPromise();
  }

  saveSalesRenoRepo(
    body: any,
  ): Promise<{
    orderNumber: string;
    orderMessage: string;
    orderTicket: string;
    saleNumber: string;
  }> {
    return this.apiService
      .post(this.apiService.saveSalesRenoRepo, body)
      .toPromise();
  }
}
