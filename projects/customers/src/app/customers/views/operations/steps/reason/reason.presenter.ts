import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, subscribeOn } from 'rxjs/operators';
import { ErrorResponse, CRMErrorService } from '@claro/crm/commons';
import { IParameter, ReasonsService } from '@customers/app/core';

@Injectable()
export class ReasonPresenter {
  error: ErrorResponse;
  customersReasons$: Observable<IParameter[]>;
  tgfiReasons$: Observable<IParameter[]>;
  tgfiReasonsParameter : IParameter[];

  constructor(
    private reasonsService: ReasonsService,
    private errorService: CRMErrorService,
  ) {
    this.customersReasons$ = this.reasonsService.getCustomersReasons().pipe(
      catchError(error => {
        this.error = this.errorService.showError(
          error,
          'CRM-1001',
          true,
        );
        return throwError(error);
      }),
    );
    this.tgfiReasons$ = this.reasonsService.getTgfiReasons().pipe(
      catchError(error => {
        this.error = this.errorService.showError(
          error,
          'CRM-1002',
          true,
        );
        return throwError(error);
      })
    ),
    this.tgfiReasons$.subscribe((data) => {
      this.tgfiReasonsParameter = data;
      this.tgfiReasonsParameter.splice(0,0,{value:'', label: 'Selecciona'} as IParameter);
    });
  }
}
