import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PaymentPending, PaymentPendingResponse } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  constructor(private apiService: ApiService) {}

  getPaymentsSummary(body: any): Promise<any> {
    return this.apiService.post(this.apiService.paymentDetail, body)
      .pipe(
        map(response => {
          return response;
        })
      )
      .toPromise();
  }
}
