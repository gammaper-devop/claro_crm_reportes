import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AddressIdentifier,
  AddressIdentifierResponse,
  IParameter,
  PaymentType,
  PaymentTypeResponse,
} from '../models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  suggestedDates: IParameter[];

  constructor(private apiService: ApiService) {}

  getAddressIdentifier(): Observable<AddressIdentifier[]> {
    return this.apiService
      .get(this.apiService.addressIdentifier)
      .pipe(
        map(response =>
          response.map(
            (addressIdentifier: AddressIdentifierResponse) =>
              new AddressIdentifier(addressIdentifier),
          ),
        ),
      );
  }

  getAddressType(): Observable<IParameter[]> {
    return this.apiService.get(this.apiService.addressType).pipe(
      map(res =>
        res.map(
          addressType =>
            ({
              value: addressType.code,
              label: addressType.description,
            } as IParameter),
        ),
      ),
    );
  }

  getSuggestedDates(officeCode: string): Promise<IParameter[]> {
    return this.apiService
      .get(`${this.apiService.suggestedDates}/${officeCode}`)
      .pipe(
        map((suggestedDates: {}[]) => {
          this.suggestedDates = suggestedDates.map(
            suggestedDate =>
              ({
                value: suggestedDate,
                label: suggestedDate,
              } as IParameter),
          );
          return this.suggestedDates;
        }),
      )
      .toPromise();
  }

  getAvailableDates(body: any): Promise<{ success: boolean }> {
    return this.apiService
      .post(this.apiService.availableDates, body)
      .toPromise();
  }

  getProviders(): Observable<IParameter[]> {
    return this.apiService.get(this.apiService.providers).pipe(
      map(res =>
        res.map(
          provider =>
            ({
              value: provider.code,
              label: provider.description,
            } as IParameter),
        ),
      ),
    );
  }

  getPaymentTypes(body: any): Observable<PaymentType[]> {
    return this.apiService
      .post(this.apiService.paymentTypes, body)
      .pipe(
        map(response =>
          response.map(
            (paymentType: PaymentTypeResponse) => new PaymentType(paymentType),
          ),
        ),
      );
  }
}
