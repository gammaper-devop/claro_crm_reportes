import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Encryptor } from '@claro/commons/encryptor';
import { AuthService, User, UserResponse } from '@shell/app/core';
import { environment } from '@shell/environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private encryptor: Encryptor,
    private authService: AuthService,
    private apiService: ApiService,
  ) {}

  validateAccount(body: any): Promise<User> {
    if (!environment.mock && body.userAccount === 'mockAdmin') {
      body = {
        userAccount: 'E750337',
        password: 'PERU@@202007',
        application: '227',
        mockAdmin: true,
      };
    }
    body.password = this.encryptor.encrypt(body.password);
    return this.authService.generateToken(body);
  }

  validateIdentification(user: User, body: any): Promise<User> {
    return this.apiService
      .get(this.apiService.validateIdentification, body)
      .pipe(
        map((userResponse: UserResponse) => user.update(user, userResponse)),
      )
      .toPromise();
  }
}
