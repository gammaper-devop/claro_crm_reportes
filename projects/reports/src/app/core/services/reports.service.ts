import { Injectable } from '@angular/core';
import { LocalStorage } from '@claro/commons/storage';
import { ListSellersReport } from '../models/sellers-report.models';
import { ApiService } from './api.service';
import { PortabilityParam, PortabilityParamResponse } from '../models/portability.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Criteria,  CriteriaResponse, } from '../models/criteria.model';

@Injectable({
  providedIn: 'root',
})
export class CRMReportsService {

  stateCriteria = 'claro-customerSearchCriteria';
  status: PortabilityParam[];

  constructor(private storage: LocalStorage,private apiService: ApiService) {}

  getSellerList(body: any): Promise<ListSellersReport[]> {
    return this.apiService.post(
        this.apiService.sellerLists, body
      )
      .toPromise();
  }

  getList(body: any): Observable<Criteria[]> {
    const stateCriteria = this.storage.get(this.stateCriteria);
    if (stateCriteria) {
      return of(stateCriteria);
    } else {
      return this.apiService.post(`${this.apiService.criteria}`, body).pipe(
        map((res: { criterias: CriteriaResponse[] }) =>
          res.criterias.map(
            (criteria: CriteriaResponse) => new Criteria(criteria),
          ),
        ),
        map(parameters => {
          this.storage.set(this.stateCriteria, parameters);
          return parameters;
        }),
      );
    }
  }
  //.get(`${this.apiService.portabilityParams}/${cboKey}`, params);

  getPortabilityParam(
    cboKey: string,
    params?: any,
  ): Promise<PortabilityParam[]> {
    // this.status = [
    //   {
    //     label: 'Activo',
    //     value: 'A',
    //     cboKey: 'CBO_EST_VEN',
    //     paramRequired: ''
    //   },
    //   {
    //     label: 'Inactivo',
    //     value: 'I',
    //     cboKey: 'CBO_EST_VEN',
    //     paramRequired: ''
    //   },
    // ]   

   // return Promise.all(this.status);
    console.log("Ingresa al servicio: ", cboKey);
    return this.apiService
      .get(`${this.apiService.generics}/${cboKey}`)
      .pipe(
        map(response =>
          response.map(
            (param: PortabilityParamResponse) => new PortabilityParam(param),
          ),
        ),
      ).toPromise();
  }
}