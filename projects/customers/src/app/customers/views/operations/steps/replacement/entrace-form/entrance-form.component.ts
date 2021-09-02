import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { User } from '@shell/app/core';
import { Customer, PortabilityParam } from '@customers/app/core';
import { ISelectOptions, ISelectValues } from '../replacement.interface';
import { EntranceFormPresenter } from './entrance-form.presenter';
import { CRMErrorService, EErrorType, ErrorCodes, Generics } from '@claro/crm/commons';

@Component({
  selector: 'app-entrance-form',
  templateUrl: './entrance-form.component.html',
  styleUrls: ['./entrance-form.component.scss'],
  providers: [EntranceFormPresenter, CRMErrorService],
})
export class EntranceFormComponent implements OnInit {
  @Input() formLine: FormGroup;
  @Input() parentForm: FormArray;
  @Input() selectOptions: ISelectOptions;
  @Input() selectValues: ISelectValues;
  @Input() user: User;
  @Input() customer: Customer;
  @Input() saleOperationType: string;
  @Input() showNextBtn: boolean;
  @Output() displayNextBtn = new EventEmitter<boolean>();
  @Output() prevStep = new EventEmitter();
  valid: boolean;
  replacementValid = false;
  typeSelected: string;

  constructor(
    public presenter: EntranceFormPresenter,
    private errorService: CRMErrorService
  ) {
    this.valid = false;
    this.typeSelected = '';
  }

  get phone(): string {
    return this.formLine.controls.phoneNumber.value;
  }

  get totalLines(): number {
    return this.parentForm.controls.length;
  }

  ngOnInit() {
    this.getCboServices();
    this.getCboModOrigins();
    this.getCboRepTypes();
  }

  getCboServices() {
    this.presenter.getCboServices().then((options: PortabilityParam[]) => {
      this.selectOptions.cboServices = options;
    });
  }

  getCboModOrigins() {
    this.presenter.getCboModOrigins().then((options: PortabilityParam[]) => {
      this.selectOptions.cboModOrigins = options;
    });
  }

  getCboRepTypes() {
    this.presenter.getCboRepTypes().subscribe((options: Generics[]) => {
      this.selectOptions.cboRepTypes = options;
    });
  }

  async validateReplacementNumber() {
    let response;
    
    if (!this.valid) {      
      response = await this.presenter.validateReplacementNumber(
        this.phone,
        this.user,
        this.customer,
        this.typeSelected);
      if (response) {

        console.log(response.ageLine);
        localStorage.setItem('ageLineReplacement',  response.ageLine);
        let response2=JSON.stringify(response);
        localStorage.setItem('ResponseLineReplacement',  response2);
        const productType = {
          value: response.productType,
          label: response.productType
        };

        // this.formLine.patchValue({
        //       flagCustomer: response.flagCustomer,
        //       flagTechnology: response.flagTechnology,
        //       typeHlr: response.typeHlr,
        //       currentSerie: response.iccid,
        //       contractCodePublic: response.contractCodePublic,
        //       blockData: response.blockData,
        //       blockFlag: response.blockFlag,
        //       unblockFlagManual: response.unblockFlagManual,
        //       productType: productType,
        //       ready: true
        // });
        
        // this.valid = true;
        // this.displayNextBtn.emit();
        if (this.selectValues.cboService.value === response.productType) {
          this.formLine.patchValue({
            flagCustomer: response.flagCustomer,
            flagTechnology: response.flagTechnology,
            typeHlr: response.typeHlr,
            currentSerie: response.iccid,
            contractCodePublic: response.contractCodePublic,
            blockData: response.blockData,
            blockFlag: response.blockFlag,
            unblockFlagManual: response.unblockFlagManual,
            productType: productType,
            ready: true
          });
          this.valid = true;
          this.displayNextBtn.emit(false);
        } else {
          this.formLine.get('ready').setValue(false);
          this.valid = true;
          this.displayNextBtn.emit(true);
          this.presenter.error = {
            code: 'CRM-2007',
            title: 'Error',
            description: 'Linea no corresponde al servicio seleccionado',
            errorType: EErrorType.Functional,
          } ;
        }
        
      } else {
        this.formLine.get('ready').setValue(false);
        this.valid = true;
        this.displayNextBtn.emit(true);
      }
    }
  }

  phoneExists() {
    return (
      this.parentForm.controls.filter(
        formGroup => formGroup.value.phoneNumber === this.phone,
      ).length > 1
    );
  }

  resetLine() {
    this.replacementValid = false;
    this.presenter.error = null;
    this.valid = false;
    this.formLine.get('ready').reset();
    this.displayNextBtn.emit(true);
    this.previousStep();
  }

  previousStep() {
    this.prevStep.emit();
  }

  onChangeService(item: PortabilityParam) {
    this.selectValues.cboService = item;
  }

  onChangeNumber() {
    this.presenter.error = null;
  }

  onChangeType(event: Generics) {
    this.typeSelected = event.value;
  }
}
