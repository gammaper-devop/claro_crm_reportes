import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { IParameter } from '@customers/app/core';

@Injectable({
  providedIn: 'root',
})
export class ReasonsService {
  constructor(private apiService: ApiService) {}
  objectForValueWhite : Observable<IParameter[]>;

  getCustomersReasons(): Observable<IParameter[]> {
    return this.apiService.get(this.apiService.customersReasons).pipe(
      map(res =>
        res.map(
          customerReason =>
            ({
              value: customerReason.code,
              label: customerReason.description,
            } as IParameter),
        ),
      ),
    );
  }

    getTgfiReasons(): Observable<IParameter[]> {​​​
    this.objectForValueWhite = this.apiService.get(this.apiService.tgfiReasons).pipe(
      map(res =>
        res.map(
          tgfiReason => 
            ({​​​
            value: tgfiReason.code,
            label: tgfiReason.description,
            }​​​ as IParameter),
        ),
      ),
    );
    return this.objectForValueWhite;
  }​​​
}
