import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse, CRMErrorService } from '@claro/crm/commons';
import { IParameter, DispatchOptionsService } from '@customers/app/core';

@Injectable()
export class DispatchOptionsPresenter {
  error: ErrorResponse;
  dispatchOptions$: Observable<IParameter[]>;

  constructor(
    private dispatchOptionsService: DispatchOptionsService,
    private errorService: CRMErrorService,
  ) {
    this.getDispatchOptions();
  }

  getDispatchOptions() {
    this.dispatchOptions$ = this.dispatchOptionsService
      .getDispatchOptions()
      .pipe(
        catchError(error => {
          this.error = this.errorService.showError(
            error,
            'CRM-1009',
            true,
          );
          return throwError(error);
        }),
      );
  }
}
