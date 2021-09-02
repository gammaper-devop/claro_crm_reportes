import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UTILS } from '@claro/commons';
import { EErrorType, EErrorTitle, ErrorResponse } from '@claro/crm/commons';
import { MessageBus } from '@claro/commons/message-bus';
import { environment } from '@shell/environments/environment';
import { AuthService } from '../services';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private errorExists = false;

  constructor(
    private messageBus: MessageBus,
    private authService: AuthService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const user = this.authService.getUser();
    this.authService.validateRefreshToken(token, user);
    const config = require('@shell/assets/config/microapp.json');
    if (
      !this.errorExists &&
      (config.tracing.technical || config.tracing.functional)
    ) {
      this.messageBus.emit('shellChannel', 'UUID', null);
    }
    this.errorExists = false;
    const uuid = UTILS.uuid();
    if (!environment.mock && token && token.accessToken) {
      const headers = {
        ...config.headers,
        ...{
          idTransaccion: uuid,
          'Request-ID': uuid,
          access_token: token.accessToken,
          userId: user ? user.account : 'E750102',
          'request-date': UTILS.formatISODate(new Date(), true),
          ip: this.authService.ip,
          'app-name': 'WebPrepago',
          'caller-name' : 'WebPrepago',
          'app-code' : '227',
        },
      };
      request = request.clone({ setHeaders: headers });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if (err.status === 401) {
          this.authService.logout();
          location.reload();
        }
        let error: any = err.status && err.status !== 0 ? err.error : err;
        error = error as ErrorResponse;
        if (
          (config.tracing.technical &&
            error.errorType === EErrorType.Technical) ||
          (config.tracing.functional &&
            error.errorType === EErrorType.Functional)
        ) {
          this.errorExists = true;
          setTimeout(() => {
            this.errorExists = false;
          }, 2000);
          error.id = uuid;
          this.messageBus.emit('shellChannel', 'UUID', uuid);
        }
        error.title =
          error.errorType === EErrorType.Functional
            ? EErrorTitle.Functional
            : EErrorTitle.Technical;
        return throwError(error);
      }),
    );
  }
}
