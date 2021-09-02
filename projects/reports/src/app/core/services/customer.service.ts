import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SessionStorage } from '@claro/commons/storage';
import {
  Customer,
  CustomerResponse,
  Department,
  DepartmentResponse,
  District,
  DistrictResponse,
  PopulatedCenter,
  PopulatedCenterResponse,
  Province,
  ProvinceResponse,
  Ubigeo,
  UbigeoResponse,
} from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  stateCustomer = 'claro-customer';
  stateInitRoute = 'customersInit';

  constructor(
    private router: Router,
    private session: SessionStorage,
    private apiService: ApiService,
  ) {}

  isInitRoute(): boolean {
    return !!this.session.get(this.stateInitRoute);
  }

  validateInitRoute() {
    if (this.isInitRoute()) {
      this.router.navigate(['clientes', 'busqueda']);
    }
  }

  removeInitRoute() {
    if (this.isInitRoute()) {
      this.session.remove(this.stateInitRoute);
    }
  }

  setCustomer(customer: Customer): void {
    this.session.set(this.stateCustomer, customer);
  }

  getCustomer(): Customer {
    return this.session.get(this.stateCustomer);
  }

  getDepartments(): Observable<Department[]> {
    return this.apiService.get(this.apiService.departments).pipe(
      map(response =>
        response.map(
          (department: DepartmentResponse) => new Department(department),
        ),
      ),
      map((response: Department[]) =>
        response.filter(department => department.value !== '42'),
      ),
    );
  }

  getProvinces(departmentCode: string): Observable<Province[]> {
    return this.apiService
      .get(`${this.apiService.provinces}/${departmentCode}`)
      .pipe(
        map(response =>
          response.map((province: ProvinceResponse) => new Province(province)),
        ),
      );
  }

  getDistricts(parameters: any): Observable<District[]> {
    return this.apiService
      .get(
        `${this.apiService.districts}/${parameters.departmentCode}/${parameters.provinceCode}`,
      )
      .pipe(
        map(response =>
          response.map((district: DistrictResponse) => new District(district)),
        ),
      );
  }

  postCustomerAdd(body: any): Promise<Customer> {
    return this.apiService
      .post(this.apiService.customerAdd, body)
      .pipe(
        map((response: CustomerResponse) => {
          const customer = new Customer(response);
          this.setCustomer(customer);
          return customer;
        }),
      )
      .toPromise();
  }

  getUbigeos(departmentCode: string): Promise<Ubigeo[]> {
    return this.apiService
      .get(`${this.apiService.ubigeos}/${departmentCode}`)
      .pipe(
        map(response =>
          response.map((ubigeo: UbigeoResponse) => new Ubigeo(ubigeo)),
        ),
      )
      .toPromise();
  }

  getPopulatedCenters(ubigeoCode: string): Promise<PopulatedCenter[]> {
    return this.apiService
      .get(`${this.apiService.populatedCenters}/${ubigeoCode}`)
      .pipe(
        map(response =>
          response.map(
            (populatedCenter: PopulatedCenterResponse) =>
              new PopulatedCenter(populatedCenter),
          ),
        ),
      )
      .toPromise();
  }

  update(currentCustomer: Customer, newCustomer: CustomerResponse) {
    currentCustomer.customerCode = newCustomer.customerCode
      ? newCustomer.customerCode
      : currentCustomer.customerCode;
    currentCustomer.documentTypeCode = newCustomer.documentTypeCode
      ? newCustomer.documentTypeCode
      : currentCustomer.documentTypeCode;
    currentCustomer.documentTypeDescription = newCustomer.documentTypeDescription
      ? newCustomer.documentTypeDescription
      : currentCustomer.documentTypeDescription;
    currentCustomer.documentNumber = newCustomer.documentNumber
      ? newCustomer.documentNumber
      : currentCustomer.documentNumber;
    currentCustomer.nationalityCode = newCustomer.nationalityCode
      ? newCustomer.nationalityCode
      : currentCustomer.nationalityCode;
    currentCustomer.nationalityDescription = newCustomer.nationalityDescription
      ? newCustomer.nationalityDescription
      : currentCustomer.nationalityDescription;
    currentCustomer.civilStatusCode = newCustomer.civilStatusCode
      ? newCustomer.civilStatusCode
      : currentCustomer.civilStatusCode;
    currentCustomer.civilStatusDescription = newCustomer.civilStatusDescription
      ? newCustomer.civilStatusDescription
      : currentCustomer.civilStatusDescription;
    currentCustomer.email = newCustomer.email
      ? newCustomer.email
      : currentCustomer.email;
    currentCustomer.phoneNumber = newCustomer.phoneNumber
      ? newCustomer.phoneNumber
      : currentCustomer.phoneNumber;
    currentCustomer.legalDirection = newCustomer.legalDirection
      ? newCustomer.legalDirection
      : currentCustomer.legalDirection;
    currentCustomer.sex = newCustomer.sex
      ? newCustomer.sex
      : currentCustomer.sex;
    currentCustomer.fullName = newCustomer.fullName
      ? newCustomer.fullName
      : currentCustomer.fullName;
    currentCustomer.name = newCustomer.name
      ? newCustomer.name
      : currentCustomer.name;
    currentCustomer.firstName = newCustomer.firstName
      ? newCustomer.firstName
      : currentCustomer.firstName;
    currentCustomer.secondName = newCustomer.secondName
      ? newCustomer.secondName
      : currentCustomer.secondName;
    currentCustomer.departmentCode =
      newCustomer.departmentCode || currentCustomer.departmentCode;
    currentCustomer.provinceCode =
      newCustomer.provinceCode || currentCustomer.provinceCode;
    currentCustomer.districtCode =
      newCustomer.districtCode || currentCustomer.districtCode;
    currentCustomer.departmentDescription =
      newCustomer.departmentDesc || currentCustomer.departmentDescription;
    currentCustomer.provinceDescription =
      newCustomer.provinceDesc || currentCustomer.provinceDescription;
    currentCustomer.districtDescription =
      newCustomer.districtDesc || currentCustomer.districtDescription;
    currentCustomer.birthDate = newCustomer.birthDate
      ? newCustomer.birthDate
      : currentCustomer.birthDate;
    currentCustomer.expiryDate = newCustomer.expiryDate
      ? newCustomer.expiryDate
      : currentCustomer.expiryDate;
    currentCustomer.uniqueCustomerCode = newCustomer.uniqueCustomerCode
      ? newCustomer.uniqueCustomerCode
      : currentCustomer.uniqueCustomerCode;
    currentCustomer.participantId = newCustomer.participantId
      ? newCustomer.participantId
      : currentCustomer.participantId;
    currentCustomer.customerCodePublic = newCustomer.customerCodePublic
      ? newCustomer.customerCodePublic
      : currentCustomer.customerCodePublic;
  }
}
