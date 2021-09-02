import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ITHead } from '@claro/commons/src/components/organisms/table/table.interface';
import { AuthService, User } from '@shell/app/core';
import {
  Customer,
  CustomerService,
  ProfileService
} from '@biometric/app/core';
import { BiometricPresenter } from './biometric.presenter';

import { Router } from '@angular/router';
import { MemoryStorage, LocalStorage, SessionStorage } from '@claro/commons/storage';
import { UTILS } from '@claro/commons';
import { BiometricBody } from '@claro/crm/commons';

@Component({
  selector: 'app-biometric',
  templateUrl: './biometric.view.html',
  styleUrls: ['./biometric.view.scss'],
  providers: [BiometricPresenter],
})
export class BiometricComponent {
  user: User;
  customer: Customer;
  body: BiometricBody;
  biometricType: string;
  isLoading: boolean;
  valueSearch: any;
  contractsForm: FormGroup;
  indexTab: number;
  valueDate: Date;
  selectIndex: number;
  documentTypeId: string;
  showActionBar = false;

  @Output() public activeActionBar = new EventEmitter();

  constructor(
    public presenter: BiometricPresenter,
    private fb: FormBuilder,
    private authService: AuthService,
    private customerService: CustomerService,
  ) {
    this.user = this.authService.getUser();
    this.customer = this.customerService.getCustomer();
    this.biometricType = 'customers';
    this.loading();

    this.createForm();
    this.valueDate = new Date();
    this.indexTab = 0;
  }
 async loading(){
  this.isLoading = true;
    const response = await this.presenter.getBiometricConfig(
      this.user.office,
      '02',
      'VEN01',
    );
   
    this.body = {
      person: this.customer,
      errorSale: this.presenter.errorSale,
      scanBiometric: true,
      flagBio: true,
      user: this.user,
      limitBiometricAttempts: 3,
      orderNumber: ''
    };
    this.isLoading = false;


  }


  createForm() {
    this.contractsForm = this.fb.group({
      datepicker: ['', Validators.required],
    });
  }

  scanFingers(){

  }

  leaveReceived(){

  }

  onSubmit(form: any) {
 /*    this.valueSearch = form;
    this.presenter.postSearch(form).then(() => {
      if (this.presenter.customers && this.presenter.customers.length === 1) {
        this.selectCustomer(this.presenter.customers[0]);
      }
    }); */
  }

  searchChanged() {
  //  this.presenter.customers = undefined;
  }
 // selectCustomer(customer: Customer) {
  //  this.presenter.setCustomer(customer);
/*     this.memory.remove('payments');
    this.router.navigate(['/clientes/perfil']); */
 // }

}
