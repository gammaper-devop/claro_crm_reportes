import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EInputValidation } from '@claro/commons';

import { ListSellersReport } from '@reports/app/core/models/sellers-report.models';
import { PortabilityParam } from '@sellers/app/core';
import { SellersPresenter } from './sellers.presenter';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss'],
  providers: [SellersPresenter]
})
export class SellersComponent implements OnInit {

  reportsForm: FormGroup;

  selectValue = '';
  maxLength = 8;
  inputType: EInputValidation;
  type: string;
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
    public presenter: SellersPresenter,
    private fb: FormBuilder,
    private router: Router
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
    console.log("Vendedores del Reports");
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

  goBack(){
    this.router.navigate(['/reportes/operaciones']);
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
