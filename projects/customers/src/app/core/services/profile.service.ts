import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { PaymentPending, PaymentPendingResponse } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private apiService: ApiService) {}

  getPayments(body: any): Promise<PaymentPending[]> {
    return this.apiService
      .post(this.apiService.payment, body)
      .pipe(
        map(response => {
          return response.map(
            (operation: PaymentPendingResponse) =>
              new PaymentPending(operation),
          );
        }),
      )
      .toPromise();
  }
}
