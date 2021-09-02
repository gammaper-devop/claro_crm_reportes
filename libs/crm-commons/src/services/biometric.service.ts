import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { UTILS } from '@claro/commons';
import { ErrorCodes } from '../global';
import {
  Biometric,
  BiometricResponse,
  Person,
  PersonResponse,
  SecurityQuestionResponse,
  SecurityQuestion,
} from '../models';
import { CRMApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CRMBiometricService {
  constructor(private apiService: CRMApiService) {}

  getBestFingerprint(body: any): Promise<Biometric> {
    return this.apiService
      .post(this.apiService.getBestFingerprint, body)
      .pipe(map((response: BiometricResponse) => new Biometric(response)))
      .toPromise();
  }

  getQuestions(body: any): Observable<SecurityQuestion[]> {
    return this.apiService.post(this.apiService.getSecurityQuestions, body).pipe(
      map(response =>
        response.map(
          (question: SecurityQuestionResponse) =>
            new SecurityQuestion(question),
        ),
      ),
      map(questions => questions),
    );
  }

  async scanFingerprint(
    biometric: Biometric,
    config: {
      api: string;
      mock: boolean;
    },
  ): Promise<boolean> {
    if (!config.mock) {
      const body = {
        r: Math.random(),
        op: 'bioTxnCLARO',
        tiDoc: '0',
        nuDoc: '00000000',
        pk: '',
        width: '256',
        height: '394',
        consolidate: '0',
        halfSize: '0',
        imgFlag: '3',
        typeFlag: '0',
        flagHide: '1',
        timeOut: '25',
        idFinger: '2',
        th1: '60',
        th2: '3',
      };
      const parameters = UTILS.encodeObject(body);
      try {
        const response = await fetch(`${config.api}?${parameters}`, {
          method: 'GET',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
        if (!response.ok) {
          return Promise.reject();
        }
        const responseText = await response.text();
        if (!responseText) {
          return Promise.reject();
        }
        const responseList: string[] = responseText.split(':');
        if (responseList[0] !== '19000') {
          return Promise.reject(responseList[0]);
        }
        biometric.fingerprintImage = '0';
        biometric.fingerprintValue = UTILS.hexToBase64(responseList[5]);
        return Promise.resolve(true);
      } catch (error) {
        return Promise.reject();
      }
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const biometricService = Math.random() > 0.1;
          if (!biometricService) {
            return reject();
          }
          const fingerprintStatus = Math.random() > 0.2;
          if (!fingerprintStatus) {
            return reject(ErrorCodes['CRM-906']);
          }
          biometric.fingerprintImage = '0';
          biometric.fingerprintValue = '0';
          return resolve(true);
        }, 1000);
      });
    }
  }

  validateSecurityQuestions(body: any): Promise<{}> {
    return this.apiService
      .post(this.apiService.validateSecurityQuestions, body)
      .toPromise();
  }

  validateFingerprint(body: any): Promise<{}> {
    return this.apiService
      .post(this.apiService.validateFingerprint, body)
      .toPromise();
  }

  passBiometric(body: any) {
    return this.apiService
      .post(this.apiService.passBiometric, body)
      .toPromise();
  }

  postBiometricStatus(body: any): Promise<{ success: boolean }> {
    return this.apiService
      .post(this.apiService.biometricStatus, body)
      .toPromise();
  }

  update(currentCustomer: Person, newCustomer: PersonResponse) {
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
