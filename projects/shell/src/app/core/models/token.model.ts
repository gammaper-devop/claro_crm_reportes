import { UserResponse } from './user.model';

export class Token {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresInTime: number;
  refreshExpiresIn: number;
  refreshExpiresInTime: number;

  constructor(token?: UserResponse) {
    this.accessToken = token && token.accessToken ? token.accessToken : 'accessToken';
    this.refreshToken = token && token.refreshToken ? token.refreshToken : 'refreshToken';
    this.expiresIn = token && token.expiresIn ? token.expiresIn : 3600;
    this.expiresInTime = this.expiresIn * 1000 + new Date().getTime();
    this.refreshExpiresIn = token && token.refreshExpiresIn ? token.refreshExpiresIn : 600;
    this.refreshExpiresInTime = this.refreshExpiresIn * 1000 + new Date().getTime();
  }
}
