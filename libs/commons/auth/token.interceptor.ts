import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';

import { Authentication } from './authentication';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: Authentication) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.auth.config.interceptor) {
      const token = this.auth.getToken();
      const headers = JSON.parse(
        '{"' +
          this.auth.config.headerName +
          '":"' +
          this.auth.config.tokenType +
          ' ' +
          token +
          '"}'
      );
      if (token !== '') {
        req = req.clone({
          setHeaders: headers
        });
      }
    }
    return next.handle(req);
  }
}
