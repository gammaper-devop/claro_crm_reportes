import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ErrorResponse,
  CRMGenericsService,
  CRMErrorService,
} from '@claro/crm/commons';
import { MultipointsService } from '@customers/app/core';
import { User } from '@shell/app/core';
import { IParameter } from '@customers/app/core';

@Injectable()
export class MultipointsPresenter {
  error: ErrorResponse;
  pointSale: IParameter[];
  sellers$: Observable<IParameter[]>;

  constructor(
    private genericsService: CRMGenericsService,
    private multipointService: MultipointsService,
    private errorService: CRMErrorService,
  ) {}

  async getPointsSale(channel: string, user: User) {
    this.error = null;
    this.pointSale = [];
    const body = {
      consultType: '2',
      officeCode: user.office,
      channelCode: channel,
      profileCode: user.chainProfile,
    };
    try {
      const response = await this.multipointService.postMultipointQuery(body);
      this.pointSale = response.listMultipoint;
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-2000',
        true,
      );
    }
  }

  getSellers(body: any) {
    this.sellers$ = this.multipointService.getMultipointsSellers(body).pipe(
      catchError(error => {
        this.error = this.errorService.showError(
          error,
          'CRM-1003',
          true,
        );
        return throwError(error);
      }),
    );
  }

  async setSelectedOffice(value: string) {
    this.error = null;
    try {
      await this.genericsService.getOfficeDetail(value);
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-960',
        true,
      );
    }
  }
}
