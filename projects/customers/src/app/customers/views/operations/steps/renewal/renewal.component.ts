import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorResponse } from '@claro/crm/commons';
import { User, EChannel } from '@shell/app/core';
import { environment } from '@shell/environments/environment';
import { Customer } from '@customers/app/core';
import { EStepNav } from '@customers/app/customers/views/operations/steps/steps.enum';
import { ISelectOptions, ISelectValues } from './renewal.interface';
import { RenewalPresenter } from './renewal.presenter';

@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.scss'],
  providers: [RenewalPresenter],
})
export class RenewalComponent implements OnInit {
  @Input() user: User;
  @Input() customer: Customer;
  @Input() error: ErrorResponse;
  @Input() saleOperationType: string;
  @Input() showNextBtn: boolean;
  @Output() linesSec = new EventEmitter();
  @Output() resolveStep: EventEmitter<EStepNav> = new EventEmitter();
  @Output() nextBtn = new EventEmitter();
  @Output() showReasonsCard = new EventEmitter();
  selectOptions: ISelectOptions;
  selectValues: ISelectValues;
  cdn = environment.cdn;
  renewalForm: FormGroup;
  maxLines = 0;

  constructor(public presenter: RenewalPresenter, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  get formLines() {
    return this.renewalForm.controls;
  }

  get lines() {
    return this.formLines.lines as FormArray;
  }

  initForm() {
    this.selectOptions = {
      cboServices: [],
      cboRenTypes: [],
    };
    this.selectValues = {
      cboService: null,
      cboRenType: null,
    };
    this.renewalForm = this.fb.group({
      lines: new FormArray([]),
    });
    this.addLine();
  }

  createLineForm(): FormGroup {
    return this.fb.group({
      cboService: [this.selectValues.cboService, Validators.required],
      cboModOrigin: ['', Validators.required],
      cboRenType: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      saleOptions: null,
      sequentialCode: null,
      due: null,
      ready: false,
      flagCustomer: '',
      flagTechnology: '',
      currentSerie: '',
      contractCodePublic: '',
      blockData: null,
      blockFlag: '',
      unblockFlagManual: '',
      productType: null,
      typeHlr: '',
    },
    {
      validator: this.matchPhoNumber('cboService', 'phoneNumber')
    });
  }

  matchPhoNumber(cboServiceparam: string, phoneNumberParam: string) {
    return (formGroup: FormGroup) => {
    
      const cboServiceControl = formGroup.controls[cboServiceparam];
      const phoneNumberControl = formGroup.controls[phoneNumberParam];
      if(cboServiceControl) {
        let cboValues = cboServiceControl.value;
        if(cboValues !=null) {
          if (cboValues.label == "TFI") {
          
            const regex = new RegExp('[0-8][0-9]{7}');
            const valid = regex.test(phoneNumberControl.value);
            if(phoneNumberControl.value.length === 8 && valid) {
              phoneNumberControl.setErrors(null);
            } else {

              phoneNumberControl.setErrors({ phoneNumberMatch: true });
            }
          }
          else {
            const regex = new RegExp('9[0-9]{8}');
            const valid = regex.test(phoneNumberControl.value);
            if(valid) {
              phoneNumberControl.setErrors(null);
            }else {
              phoneNumberControl.setErrors({ phoneNumberMatch: true });
            }
          }       
        }
        
      }     
      
      
    }
  }

  unreadyToContinue(): boolean {
    return (
      this.lines.length &&
      this.lines.controls.some(line => line.get('ready').value !== true)
    );
  }

  addLine() {
    this.presenter.error = null;
    this.lines.push(this.createLineForm());
  }

  async continueNextStep() {
    if (this.user.channel === EChannel.CAC) {
      this.showReasonsCard.emit();
    } else {
      this.resolveStep.emit(EStepNav.next);
    }
    this.linesSec.emit(this.presenter.getLines(this.lines));
    this.nextBtn.emit(true);
  }

  displayNextBtn(value: boolean) {
    this.nextBtn.emit(value);
  }

  prevStep() {
    this.resolveStep.emit(EStepNav.prev);
  }
}
