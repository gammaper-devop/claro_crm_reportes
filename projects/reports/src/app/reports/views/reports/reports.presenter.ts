import { Injectable } from '@angular/core';
import { CRMErrorService, CRMGenericsService, ErrorResponse, DocumentType } from '@claro/crm/commons';
import { ListSellersReport } from '@reports/app/core/models/sellers-report.models';
import { CRMReportsService } from '@reports/app/core/services/reports.service';
import { PortabilityParam } from '@sellers/app/core';
import { SellersService } from '@sellers/app/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ReportsPresenter {

  //user: User;
  error: ErrorResponse;
  showPageError: boolean;

  documentTypes$: Observable<DocumentType[]>;

  statusType: PortabilityParam[];

  listSeller: ListSellersReport[];

  constructor(
    private genericsService: CRMGenericsService,
    private reportsService: CRMReportsService,
    //private sellersService: SellersService,
    private errorService: CRMErrorService
  ) {
    this.listDocumentsTypes();
   }

   async listSellers(){
    this.listSeller = await this.reportsService.getSellerList();

    for (let i = 0; i < this.listSeller.length; i++){
      if (this.listSeller[i].employeeStatus == 'A'){
        this.listSeller[i].employeeStatus = 'Activo';
      }
      else if (this.listSeller[i].employeeStatus == 'I'){
        this.listSeller[i].employeeStatus = 'Inactivo';
      }
    }

    return this.listSeller;
   }

   listDocumentsTypes() {
    this.documentTypes$ = this.genericsService.getUserDocuments('PAG_CLI').pipe(
      catchError(error => {
        this.error = this.errorService.showError(error, 'CRM-902');
        this.showPageError = true;
        return throwError(error);
      }),
    );

    // this.statusType = [
    //   {
    //     label: "Activo",
    //     value: "A",
    //     cboKey: "CBO_SELLERS_STATUS",
    //     paramRequired: ""
    //   },
    //   {
    //     label: "Inactivo",
    //     value: "I",
    //     cboKey: "CBO_SELLERS_STATUS",
    //     paramRequired: ""
    //   }
    // ]
  }  

  async getCboSellers() {
    try {
      return await this.reportsService.getPortabilityParam(
        'CBO_SELLERS_STATUS',
      );
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-2004');
      this.showPageError = true;
    }
  }
}
