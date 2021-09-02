import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators';

import { ProgressbarService } from '@claro/commons';
import { CRMApiService } from '../services';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  blackList: string[] = [];

  constructor(
    private progressbarService: ProgressbarService,
    private apiService: CRMApiService,
  ) {
    this.blackList.push(this.apiService.registerConsult);
    this.blackList.push(this.apiService.previewConsult);
    this.blackList.push(this.apiService.portabilityRequest);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (this.blackList.indexOf(request.url) === -1) {
      this.progressbarService.show();
    }

    const onRequestFinish = (event: HttpEvent<any>) => {
      if (
        this.blackList.indexOf(request.url) === -1 &&
        (event.type === undefined || event.type === 4)
      ) {
        this.progressbarService.hide();
      }
    };

    return next.handle(request).pipe(tap(onRequestFinish, onRequestFinish));
  }
}
