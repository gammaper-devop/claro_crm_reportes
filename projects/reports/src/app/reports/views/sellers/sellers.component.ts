import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EInputValidation } from '@claro/commons';

import { ListSellersReport } from '@reports/app/core/models/sellers-report.models';
import { PortabilityParam } from '@reports/app/core/models/portability.model';
import { MemoryStorage } from '@claro/commons/storage';
import { CRMReportsService, ExportExcelService } from '@reports/app/core';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss'],
})
export class SellersComponent implements OnInit {

  isInitRoute: boolean;
  reportsForm: FormGroup;

  valueDate: Date;
  reportStatus: PortabilityParam[];
  selectValue = '';
  maxLength = 11;
  inputType: EInputValidation;
  type: string;
  inactiveCreate: boolean;
  inactiveCreateButton: boolean;
  isValidPhoneService = false;

  body: any;

  displayedColumns =
   [
    'position',
    'tipo_doc', 
    'num_doc', 
    'nombres', 
    'id_vendedor', 
    'tel_vendedor', 
    'desc_pdv',
    'estado',
    'empadronador',
    'tipo_validacion'
   ];
  
  optionStatus: PortabilityParam[];

  enableReport: boolean = false;

  dataSourceSellers: ListSellersReport[];

  minDate: Date;
  maxDate: Date;

  // tableHeader: ITHead[] = [
  //   { id: '1', label: 'Tipo doc.' },
  //   { id: '2', label: 'N° doc.' },
  //   { id: '3', label: 'Nombres' },
  //   { id: '4', label: 'Vendedor' },
  //   { id: '5', label: 'Tel. vendedor' },
  //   { id: '6', label: 'Desc. PDV' },
  //   { id: '7', label: 'Estado' },
  //   { id: '8', label: 'Empadro.' } = registerUser,
  //   { id: '9', label: 'Tip. valid.' } = authentication,
  //   { id: '10', label: 'Región' },
  // ];
  
  constructor(
    private router: Router,
    private memory: MemoryStorage,
    private reportsService: CRMReportsService,

  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
   }

  ngOnInit() {
    this.isInitRoute = this.reportsService.isInitRoute();
    this.reportsService.validateInitRoute();
    
    if (this.isInitRoute) {
      console.log("ngOnInit() SellersComponent return: ");
      return;
    }
    
  }

  // async onSearch(){
  //   this.enableReport = true;

  //   this.body = {
  //     documentType: this.reportsForm.get('documentType').value,
  //     documentNumber: this.reportsForm.get('documentNumber').value,
  //     accountNet:"",
  //     registrationDate: this.reportsForm.get('startDate').value,
  //     lowDate: this.reportsForm.get('endDate').value, 
  //     dealerCode: "",
  //     regionDes: "",
  //     pointSaleCode: "",
  //     typeSearch: this.reportsForm.get('status').value
  //   };

  //   console.log("Datos Body", JSON.stringify(this.body));
  //   const response = await this.presenter.listSellers(this.body);

  //   this.dataSourceSellers = response;
    
  //   return this.dataSourceSellers;
  // }

  // getCboSellers() {
  //   console.log("Entrando servicio logSellers")
  //   this.presenter.getCboSellersReports().then((options: PortabilityParam[]) => {
  //    this.reportStatus = options;
  //  });
  //  }

  goBack(){
    this.router.navigate(['/reportes/operaciones']);
  }

  changeDocType(e){
    
  }

  searchSellersEvent(data: any) {
    
    console.log("data receive: ", data);
    this.enableReport=true;
    this.dataSourceSellers = data;

  }
  // changeState(state: string) {
  //   console.log("Ingreso changeState.");
  // }

  // changeRegion(region: string) {
  //   console.log("Ingreso changeRegion.");
  // }

  // changeSeller(seller: string){
  //   console.log("Ingreso changeSeller.");
  // }

  valueChanged(e) {

  }

  tSelectValue(e){

  }

  onSubmit(){
    console.log("Ingreso OnSubmit.");
    
  }
}
