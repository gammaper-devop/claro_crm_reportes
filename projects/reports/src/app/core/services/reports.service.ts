import { Injectable } from '@angular/core';
import { ListSellersReport } from '../models/sellers-report.models';
import { ApiService } from './api.service';
import { PortabilityParam, PortabilityParamResponse } from '../models/portability.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class CRMReportsService {
  constructor(private apiService: ApiService) {}

  getSellerList(): Promise<ListSellersReport[]> {
    return this.apiService.get(this.apiService.sellerLists).toPromise();
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
}