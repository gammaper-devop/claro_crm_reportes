import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IParameter, MultipointResponse, Multipoint } from '../models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MultipointsService {
  listSellers: any;
  constructor(private apiService: ApiService) {}

  postMultipointQuery(body: any): Promise<Multipoint> {
    return this.apiService
      .post(this.apiService.multipointQuery, body)
      .pipe(map((multipoint: MultipointResponse) => new Multipoint(multipoint)))
      .toPromise();
  }

  getMultipointsSellers(body: any): Observable<IParameter[]> {
    return this.apiService.post(this.apiService.sellerQuery, body).pipe(
      map(res =>
        res.map(
          listSellers =>
            ({
              value: listSellers.code,
              label: listSellers.name,
            } as IParameter),
        ),
      ),
    );
  }
}
