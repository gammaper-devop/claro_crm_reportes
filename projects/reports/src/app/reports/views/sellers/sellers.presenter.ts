import { Injectable } from '@angular/core';
import { CRMErrorService, CRMGenericsService, ErrorResponse, DocumentType } from '@claro/crm/commons';
import { SearchService } from '@customers/app/core';
import { ListSellersReport } from '@reports/app/core/models/sellers-report.models';
import { CRMReportsService } from '@reports/app/core/services/reports.service';
import { AuthService, User } from '@shell/app/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SellersPresenter {

    user: User;
    minDate: Date;
    maxDate: Date;

    error: ErrorResponse;
    showPageError: boolean;
    responseError = false;
  
    documentTypes$: Observable<DocumentType[]>;
  
    listSeller: ListSellersReport[];
  
    constructor(
      private reportsService: CRMReportsService,
      private errorService: CRMErrorService,
      private authService: AuthService,
    ) {
      this.user = this.authService.getUser();

      const calendarDays = Number(
        this.user.configurations.find(config => config.key === 'calendarDays')
          ?.value || 30,
      );

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate = new Date(
        currentYear,
        currentMonth,
        currentDay - calendarDays,
      );
      this.maxDate = new Date(currentYear, currentMonth, currentDay);

      this.listDocumentsTypes();
     }
  
     async listSellers(body: any){
      this.listSeller = await this.reportsService.getSellerList(body);
  
      this.listSeller.map(
          response => {
              if(response.employeeStatus === 'A'){
                response.employeeStatus = 'Activo'
              } 
              else if (response.employeeStatus === 'I'){
                response.employeeStatus = 'Inactivo'
              }
          }
        );
        
      return this.listSeller;
    }
      /* for (let i = 0; i < this.listSeller.length; i++){
        if (this.listSeller[i].employeeStatus == 'A'){
          this.listSeller[i].employeeStatus = 'Activo';
        }
        else if (this.listSeller[i].employeeStatus == 'I'){
          this.listSeller[i].employeeStatus = 'Inactivo';
        }
      } */
  
     async listDocumentsTypes() {
      this.user = await this.authService.getUser();
      const body = {
        channel: this.user.channel,
        office: this.user.office,
        flagCensus: false
      };

      this.documentTypes$ = this.reportsService
      .getList(body)
      .pipe(
        catchError(error => {
          this.responseError = true;
          return throwError(error);
        }),
      );
    }  

    async getCboSellers() {
      try {
        return await this.reportsService.getPortabilityParam('CBO_EST_VEN');
      } catch (error) {
        this.error = this.errorService.showError(error, 'CRM-2004');
        this.showPageError = true;
      }
    }
  
    // async getCboSellers() {
    //   try {
    //     return await this.reportsService.getPortabilityParam(
    //       'CBO_SELLERS_STATUS',
    //     );
    //   } catch (error) {
    //     this.error = this.errorService.showError(error, 'CRM-2004');
    //     this.showPageError = true;
    //   }
    // }
}
