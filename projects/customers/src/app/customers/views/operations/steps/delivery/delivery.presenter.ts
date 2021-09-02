import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UTILS } from '@claro/commons';
import {
  ErrorResponse,
  Generics,
  CRMGenericsService,
  Office,
  CRMErrorService,
} from '@claro/crm/commons';
import {
  CustomerService,
  Department,
  District,
  Province,
  AddressIdentifier,
  DeliveryService,
  IParameter,
  PaymentType,
} from '@customers/app/core';

@Injectable()
export class DeliveryPresenter {
  error: ErrorResponse;
  departments: Department[] = [];
  provinces: Province[];
  districts$: Observable<District[]>;
  addressIdentifiers: AddressIdentifier[] = [];
  addressTypes$: Observable<IParameter[]>;
  suggestedDates: any = [];
  providers: IParameter[] = [];
  paymentType: PaymentType[] = [];
  paymentMethods$: Observable<PaymentType[]>;
  generics: Generics[];
  deliveryTimesRange: Generics[];
  placementsInOut: Generics[];
  showPageError = false;
  firstAvailableDate: any;
  office: Office;

  constructor(
    private customerService: CustomerService,
    private deliveryService: DeliveryService,
    private genericsService: CRMGenericsService,
    private errorService: CRMErrorService,
  ) {
    this.office = this.genericsService.getOfficeDetail();
    this.getAddressTypes();
    this.getTimeRangeInOut();
  }

  async getAddressIdentifiers() {
    if (this.addressIdentifiers.length) {
      return;
    }
    try {
      this.addressIdentifiers = await this.deliveryService.getAddressIdentifier()
      .toPromise();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-1003', true);
      return throwError(error);
    }
  }

  getAddressTypes() {
    this.addressTypes$ = this.deliveryService.getAddressType().pipe(
      catchError(error => {
        this.error = this.errorService.showError(
          error,
          'CRM-1003',
          true,
        );
        return throwError(error);
      }),
    );
  }

  async getDepartments() {
    if (this.departments.length) {
      return;
    }
    try {
      this.departments = await this.customerService.getDepartments()
      .toPromise();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-933', true);
      return throwError(error);
    }
  }

  async getProviders() {
    if (this.providers.length) {
      return;
    }
    try {
      this.providers = await this.deliveryService.getProviders()
    .toPromise();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-1006', true);
      return throwError(error);
    }
  }

  async getSuggestedDates() {
    if (this.suggestedDates.length) {
      return;
    }
    try {
      this.suggestedDates = await this.deliveryService.getSuggestedDates(this.office.officeCode);
      const dateSplit = this.suggestedDates[0].value.split('/');
      const day = Number(dateSplit[0]);
      const month = Number(dateSplit[1]) - 1;
      const year = Number(dateSplit[2]);
      this.firstAvailableDate = new Date(year, month, day);
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-1004',
        true,
      );
    }
  }

  async getAvailableDates(date: any): Promise<boolean> {
    this.error = null;
    const body = {
      date: UTILS.formatISODate(date),
      officeCode: this.office.officeCode,
    };
    try {
      await this.deliveryService.getAvailableDates(body);
      return true;
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-1005',
      );
      return false;
    }
  }

  async getProvinces(idDepartment: string) {
    try {
      this.provinces = await this.customerService.getProvinces(idDepartment)
      .toPromise();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-934', true);
      return throwError(error);
    }
  }

  getDistricts(parameters: any) {
    this.districts$ = this.customerService.getDistricts(parameters).pipe(
      catchError(error => {
        this.error = this.errorService.showError(
          error,
          'CRM-935',
          true,
        );
        return throwError(error);
      }),
    );
  }

  async getPaymentTypes() {
    if (this.paymentType.length) {
      return;
    }
    const body = {
      consultType: '1',
      officeCode: this.office.officeCode,
      paymentCode: '',
    };
    try {
      this.paymentType = await this.deliveryService.getPaymentTypes(body)
      .toPromise();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-1007', true);
      return throwError(error);
    }
  }

  getPaymentMethods(paymentCode: string) {
    const body = {
      consultType: '2',
      officeCode: this.office.officeCode,
      paymentCode: paymentCode,
    };
    this.paymentMethods$ = this.deliveryService.getPaymentTypes(body).pipe(
      catchError(error => {
        this.error = this.errorService.showError(
          error,
          'CRM-1008',
          true,
        );
        return throwError(error);
      }),
    );
  }

  async getTimeRangeInOut() {
    this.generics = await this.genericsService
      .getGenerics('CBO_DELIVERY')
      .pipe(
        catchError(error => {
          this.error = this.errorService.showError(
            error,
            'CRM-962',
            true,
          );
          return throwError(error);
        }),
      )
      .toPromise();
    this.deliveryTimesRange = this.generics.filter(
      generic => generic.cboKey === 'CBO_DELIVERY_RANGE',
    );
    this.placementsInOut = this.generics.filter(
      generic => generic.cboKey === 'CBO_INOUT',
    );
  }
}
