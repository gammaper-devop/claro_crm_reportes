import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalStorage } from '@claro/commons/storage';
import { ErrorResponse } from '@claro/crm/commons';
import {
  Criteria,
  CriteriaResponse,
  Customer,
  CustomerResponse,
} from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  stateCriteria = 'claro-customerSearchCriteria';

  constructor(private storage: LocalStorage, private apiService: ApiService) {}

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

  postSearch(
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
}
