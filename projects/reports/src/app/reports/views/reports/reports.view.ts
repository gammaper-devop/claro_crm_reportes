import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EInputValidation } from '@claro/commons';
import { ITHead } from '@claro/commons/src/components/organisms/table-report/table-report.interface';
import { ECustomerDocument, SnackbarService } from '@claro/crm/commons';
import { ListSellersReport } from '@reports/app/core/models/sellers-report.models';
import { PortabilityParam } from '@sellers/app/core';
import { User } from '@shell/app/core';
import { ReportsPresenter } from '../reports/reports.presenter';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.view.html',
  styleUrls: ['./reports.view.scss'],
  providers: [ReportsPresenter],
})
export class ReportsComponent implements OnInit{

  //@Input() documentTypes: DocumentType[];
  reportsForm: FormGroup;

  selectValue = '';
  maxLength = 8;
  inputType: EInputValidation;
  type: string;
  user: User;
  inactiveCreate: boolean;
  inactiveCreateButton: boolean;
  isValidPhoneService = false;

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
  
  optionsStatus: PortabilityParam[];

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
    public presenter: ReportsPresenter,
    private fb: FormBuilder,
    private snackbar: SnackbarService
  ) {}

  createForm() {
    this.reportsForm = this.fb.group({
      documentType: [''],
      documentNumber: [''],
      status: [''],
      region: [''],
      seller: [''],
      startDate: [''],
      endDate: [''],
      descriptionPdv: ['']
    });
  }

  async ngOnInit() {
    this.createForm();
    this.getCboSellers();
  }

  async onSearch(){
    this.enableReport = true;
    const response = await this.presenter.listSellers();

    this.dataSourceSellers = response;
    
    return this.dataSourceSellers;
  }

  getCboSellers() {
    this.presenter.getCboSellers().then((options: PortabilityParam[]) => {
      this.optionsStatus = options;
      // if (this.optionsStatus && this.optionsStatus.length) {
      //   const defaultStatus = this.optionsStatus.find(
      //     element => element.label === 'Activo',
      //   );
      //   if (defaultStatus) {
      //     this.reportsForm.get('status').setValue(defaultStatus.value);
      //   }
      //}
    });
  }

  changeDocType(e){
    
  }

  changeState(state: string) {
    console.log("Ingreso changeState.");
  }

  changeRegion(region: string) {
    console.log("Ingreso changeRegion.");
  }

  changeSeller(seller: string){
    console.log("Ingreso changeSeller.");
  }

  valueChanged(e) {

  }

  tSelectValue(e){

  }

  onSubmit(){
    console.log("Ingreso OnSubmit.");
  }
}
