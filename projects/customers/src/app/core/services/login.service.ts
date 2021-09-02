import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Encryptor } from '@claro/commons/encryptor';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private apiService: ApiService,
              private encryptor: Encryptor) {}

  validateIdentification(body: any): Promise<{ nameVendor: string }> {
    return this.apiService
      .post(this.apiService.validateIdentification, body)
      .toPromise();
  }

  validateSupervisorAuth(body: any): Promise<{}> {
    body.password = this.encryptor.encrypt(body.password);
    return this.apiService
      .post(this.apiService.authSupervisor, body)
      .toPromise();
  }
}
