import { Injectable } from '@angular/core';
import { ErrorResponse, EErrorType, SnackbarService, ErrorCodes, CRMErrorService } from '@claro/crm/commons';
import {
  CustomerService,
  Department,
  District,
  Province,
  SearchService,
} from '@customers/app/core';
import { throwError } from 'rxjs';

@Injectable()
export class CustomerAddPresenter {

  error: ErrorResponse;
  responseError = false;
  departments: Department[] = [];
  provinces: Province[];
  districts: District[];

  constructor(
    private searchService: SearchService,
    public snackbarService: SnackbarService,
    private customerService: CustomerService,
    private errorService: CRMErrorService,
  ) {}

  async validCustomer(body): Promise<boolean> {

    let customerExist = false;

    try {

      const response = await this.searchService.postSearch(body);
      if (response && response.clientList.length) {
        customerExist = true;
        this.snackbarService.show(ErrorCodes['CRM-937'], 'error');
      }
      return Promise.resolve(customerExist);

    } catch (error) {

      if (error.errorType === EErrorType.Functional) {
      } else {
        this.error = error;
      }
    }
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

  async getProvinces(idDepartment: string) {
    try {
      this.provinces = await this.customerService.getProvinces(idDepartment)
      .toPromise();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-934', true);
      return throwError(error);
    }
  }

  async getDistricts(parameters) {
    try {
      this.districts = await this.customerService.getDistricts(parameters)
      .toPromise();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-935', true);
      return throwError(error);
    }
  }
}
