import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ProgressbarService, UTILS } from '@claro/commons';
import { LocalStorage, SessionStorage } from '@claro/commons/storage';
import { MicroAppConfigService, CRMGenericsService } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';
import { Token, User, UserResponse } from '../models';
import { ApiService } from './api.service';

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userIdentity = new BehaviorSubject<any>({});
  private isRefreshingTheToken = false;
  ip = '';

  constructor(
    private router: Router,
    private progressbarService: ProgressbarService,
    private storage: LocalStorage,
    private session: SessionStorage,
    private config: MicroAppConfigService,
    private genericsService: CRMGenericsService,
    private apiService: ApiService,
  ) {
    this.loggedIn.next(this.isAuthenticated());
    this.userIdentity.next(this.getUser());
    this.setIP();
  }

  async setIP() {
    if (this.ip) {
      return;
    }
    let ipData = this.storage.get(this.config.stateIP);
    if (ipData) {
      this.ip = ipData.query;
      return;
    }
    const response = await this.fetch(this.apiService.ip, null, 'GET');
    if (response?.ok) {
      ipData = await response.json();
      this.storage.set(this.config.stateIP, ipData);
      this.ip = ipData.query;
    }
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get user() {
    return this.userIdentity.asObservable();
  }

  async generateToken(body: any = {}): Promise<User> {
    let userResponse: UserResponse;
    let mockAdmin = false;
    if (!environment.mock) {
      if (body.mockAdmin) {
        mockAdmin = true;
        delete body.mockAdmin;
      }
      this.progressbarService.show();
      const response = await this.fetch(this.apiService.generateToken, body);
      this.progressbarService.hide();
      if (!response.ok) {
        throw await response.json();
      }
      userResponse = await response.json();
      if (mockAdmin) {
        userResponse.seller = null;
      }
    } else {
      if (body.userAccount === 'mockAdmin') {
        mockAdmin = true;
        delete body.userAccount;
      }
      if (!body.userAccount) {
        body = { userAccount: 'e760001', password: 'e760001' };
      }
      userResponse = await this.apiService
        .post(this.apiService.generateToken, body)
        .toPromise();
    }
    if (mockAdmin) {
      userResponse.profileCode = 'mockAdmin';
    }
    const user = new User(userResponse);
    if (user.officeData.officeCode) {
      this.genericsService.getOfficeDetail(user.officeData);
    }
    const token = new Token(userResponse);
    this.setState({ token });
    return user;
  }

  getToken(): Token {
    if (this.storage.get(this.config.stateAuth)) {
      const session = this.storage.get(this.config.stateAuth);
      return session.token;
    } else {
      return null;
    }
  }

  login(user: User) {
    let token = this.getToken();
    if (!token) {
      token = new Token();
    }
    if (environment.standalone && !user.officeData.officeCode) {
      this.genericsService.getOfficeDetail(user.office);
    }
    this.setState({ token, user });
    this.loggedIn.next(true);
    this.userIdentity.next(user);
  }

  getUser(): User {
    if (this.storage.get(this.config.stateAuth)) {
      const session = this.storage.get(this.config.stateAuth);
      return session.user;
    } else {
      return null;
    }
  }

  async validateRefreshToken(token: Token, user: User) {
    if (new Date().getTime() >= token?.expiresInTime) {
      this.logout();
      location.href = '/';
      return false;
    }
    if (
      !this.isRefreshingTheToken &&
      token &&
      new Date().getTime() >= token.refreshExpiresInTime
    ) {
      this.isRefreshingTheToken = true;
      const oldAccessToken = token.accessToken;
      const refresh = await this.refreshToken(token, user);
      this.isRefreshingTheToken = false;
      if (refresh) {
        setTimeout(() => {
          this.removeToken(oldAccessToken);
        }, 30000);
      }
    }
  }

  isAuthenticated(): boolean {
    if (this.getUser()) {
      const token = this.getToken();
      if (token && new Date().getTime() < token.expiresInTime) {
        return true;
      } else {
        this.logout();
        return false;
      }
    } else {
      return false;
    }
  }

  logout() {
    const token = this.getToken();
    this.removeToken(token?.accessToken);
    this.loggedIn.next(false);
    this.userIdentity.next(null);
    this.storage.clear();
    this.session.clear();
    this.router.navigate(['/']);
    if (UTILS.isIE()) {
      window.location.reload();
    }
  }

  private fetch(url: string, body?: any, method: 'GET' | 'POST' = 'POST') {
    return fetch(url, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers: { 'Content-Type': 'application/json', ip: this.ip },
    });
  }

  private async refreshToken(token: Token, user: User): Promise<boolean> {
    try {
      const body = {
        oldAccessToken: token.accessToken,
        oldRefreshToken: token.refreshToken,
      };
      let tokenResponse;
      if (!environment.mock) {
        const response = await this.fetch(this.apiService.refreshToken, body);
        tokenResponse = await response.json();
      } else {
        tokenResponse = await this.apiService
          .post(this.apiService.refreshToken, body)
          .toPromise();
      }
      token.accessToken = tokenResponse.newAccessToken;
      token.refreshToken = tokenResponse.newRefreshToken;
      token.expiresInTime = token.expiresIn * 1000 + new Date().getTime();
      token.refreshExpiresInTime =
        token.refreshExpiresIn * 1000 + new Date().getTime();
      this.setState({ token, user });
      return true;
    } catch (error) {
      return false;
    }
  }

  private async removeToken(accessToken: string): Promise<boolean> {
    try {
      if (!accessToken) {
        return;
      }
      const body = { access_token: accessToken };
      if (!environment.mock) {
        await this.fetch(this.apiService.removeToken, body);
      } else {
        await this.apiService
          .post(this.apiService.removeToken, body)
          .toPromise();
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  private setState(data: any): void {
    this.storage.set(this.config.stateAuth, data);
  }
}
