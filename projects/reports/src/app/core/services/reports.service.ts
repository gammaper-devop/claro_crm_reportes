import { Injectable } from '@angular/core';
import { LocalStorage, SessionStorage } from '@claro/commons/storage';
import { ListSellersReport } from '../models/sellers-report.models';
import { ApiService } from './api.service';
import { PortabilityParam, PortabilityParamResponse } from '../models/portability.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Criteria, CriteriaResponse, } from '../models/criteria.model';
import { Router } from '@angular/router';
import { ChildDealer, ChildDealerParam, DealersResponse, MainDealer, MainDealerParam } from '../models/dealers.model';

const stateInitRoute = "reportsInit";
@Injectable({
  providedIn: 'root',
})

export class CRMReportsService {

  stateCriteria = 'claro-customerSearchCriteria';


  status: PortabilityParam[];

  constructor(private storage: LocalStorage,
    private router: Router,
    private apiService: ApiService,
    private session: SessionStorage) { }

  isInitRoute(): boolean {
    return !!this.session.get(stateInitRoute);
  }


  validateInitRoute() {
    if (this.isInitRoute()) {
      this.router.navigate(['reportes', 'operaciones']);
    }
  }

  removeInitRoute() {
    if (this.isInitRoute()) {
      this.session.remove(stateInitRoute);
    }
  }



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

  postDealersReports(body: any): Observable<MainDealerParam[]> {
    return this.apiService.post(this.apiService.dealers, body).pipe(
      map(res =>
        res.listMainDealer.map(
          (mDealer: MainDealer) => new MainDealerParam(mDealer)
        )
      )
    );
  }

  postDealersReportSelected(body: any) : Observable<ChildDealerParam[]> {
    return this.apiService.post(this.apiService.dealers, body).pipe(
      map(response =>
        response.listDealersChild.map(
          (mDealer: ChildDealer) => new ChildDealerParam(mDealer)
        )
      )
    );
  }

  getPortabilityParam(
    cboKey: string,
    params?: any,
  ): Observable<PortabilityParam[]> {
    const urlSearch = `${this.apiService.generics}/${cboKey}`;
    return this.apiService
      .get(urlSearch)
      .pipe(
        map(response => {
         return response.map(
            (param: PortabilityParamResponse) => new PortabilityParam(param),
          );
        },

        ),
      );
  }

}