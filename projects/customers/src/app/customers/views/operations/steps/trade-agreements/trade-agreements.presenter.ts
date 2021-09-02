import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorResponse } from '@claro/crm/commons';
import {
  TradeAgreementsOptions,
  TradeAgreementsType,
} from '@customers/app/core';
import { DocumentsSignService } from '@customers/app/core/services/documents-sign.service';
import { AuthService, EChannel, User } from '@shell/app/core';
import { Customer, CustomerService } from '@customers/app/core';

@Injectable()
export class TradeAgreementsPresenter {
  user: User;
  tradeAgreements: TradeAgreementsType[];
  options: TradeAgreementsOptions[];
  error: ErrorResponse;
  tradeAgreementsForm: FormGroup;
  customer: Customer;

  public onDestroy$: Subject<void> = new Subject<void>();
  public readonly DELAY_IN_SECONDS: number = 2;
  constructor(
    private documentsSignService: DocumentsSignService,
    private fb: FormBuilder,
    private authService: AuthService,
    private customerService: CustomerService,
  ) {
    this.createForm();
    this.user = this.authService.getUser();
    this.customer = this.customerService.getCustomer();
  }

  getTradeAgreements(echannelCAC: EChannel, isRenoRepo: boolean) {
    const itemForm = this.getFormControlTradeList();
    this.tradeAgreements = this.setValueTradeAgreements(echannelCAC, isRenoRepo);
    this.options = this.tradeAgreements.map((opt, i) => {
      itemForm.push(this.createTradeAgreeListForm());
      this.getFormControlTradeList()
        .at(i)
        .get('idTradeAgreement')
        .setValue(opt.idTradeAgreement);

      if (opt.isRequired) {
        this.getFormControlTradeList()
          .at(i)
          .get('tradeAgreementValue')
          .setValidators(Validators.requiredTrue);
      }
      return {
        id: opt.idTradeAgreement,
        description: opt.tradeAgreementDesc,
        file: opt.file,
        isEnable: opt.isEnable,
        isRequired: opt.isRequired,
      } as TradeAgreementsOptions;
    });
  }

  disableChecks() {
    this.getFormControlTradeList().controls.forEach((control) => {
      control.disable();
    });
  }

  disabledLast() {
    this.getFormControlTradeList().controls[3].disable();
  }

  setValueTradeAgreements(echannelCAC: EChannel, isRenoRepo: boolean): TradeAgreementsType[] {
//mg13
    var agreements = [];  
    const result = this.user.configurations.filter(config => config.key.startsWith('contract') && config.key!='contract_AcceptCondition');

    for (var arr = result, x = 0; x < arr.length; x++ ) {
     
          var obj = {
                  num:arr[ x ].value.split('|')[0],
                  idTradeAgreement: arr[ x ].value.split('|')[1],
                  tradeAgreementDesc: arr[ x ].value.split('|')[2],
                  file:arr[ x ].value.split('|')[3],
                  isEnable: arr[ x ].value.split('|')[4]=='true' ? true :false,
                  isRequired: arr[ x ].value.split('|')[5]=='true'?true:false,
                };
                agreements.push(obj);
      
    };
   
    const result2 = this.user.configurations.filter(config => config.key=='contract_AcceptCondition');
    
    for (let x = 0; x < agreements.length; x++ ) {

      if(result2[0].value.split('|')[0]==agreements[x].num){
        
        if (this.customer.documentTypeCode !== '2' || (this.user.channel === echannelCAC && isRenoRepo)) {
       
          agreements[x].tradeAgreementDesc = result2[0].value.split('|')[2];
      
        }
      }
    };
    
    return agreements;
  }

  createForm() {
    this.tradeAgreementsForm = this.fb.group({
      tradeAgreementsList: this.fb.array([]),
    });
  }

  createTradeAgreeListForm() {
    return this.fb.group({
      tradeAgreementValue: [''],
      idTradeAgreement: [''],
    });
  }

  showPdf(url) {
    this.documentsSignService.downloadPDF(url).subscribe((data) => {
      const fileUrl = URL.createObjectURL(data);

      if (fileUrl.indexOf('blob:') !== -1) {
        window.open().location.href = fileUrl;
      }
    });
  }

  getFormControlTradeList(): FormArray {
    return this.tradeAgreementsForm.get('tradeAgreementsList') as FormArray;
  }
}
