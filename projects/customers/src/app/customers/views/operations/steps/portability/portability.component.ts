import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  BiometricConfig,
  DialogService,
  ErrorResponse,
  CRMErrorService,
} from '@claro/crm/commons';
import { User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';
import { Customer, EAuthSupervisor } from '@customers/app/core';
import { EStepNav } from '@customers/app/customers/views/operations/steps/steps.enum';
import { ISelectOptions, ISelectValues } from './portability.interface';
import { PortabilityPresenter } from './portability.presenter';
import { DeclarationKnowledgeComponent } from './declaration-knowledge/declaration-knowledge.component';
import { SupervisorAuthComponent } from '../supervisor-auth/supervisor-auth.component';

@Component({
  selector: 'app-portability',
  templateUrl: './portability.component.html',
  styleUrls: ['./portability.component.scss'],
  providers: [PortabilityPresenter],
})
export class PortabilityComponent implements OnInit {
  @Input() user: User;
  @Input() customer: Customer;
  @Input() error: ErrorResponse;
  @Input() withBiometric: boolean;
  @Input() isCAC: boolean;
  @Input() biometricConfig: BiometricConfig;
  @Input() saleOperationType: string;
  @Input() virtualOfficeTypeFlag: boolean;
  @Output() linesSec = new EventEmitter();
  @Output() resolveStep: EventEmitter<EStepNav> = new EventEmitter();
  @Output() secNumber: EventEmitter<string> = new EventEmitter();
  @Output() maxLinesService = new EventEmitter();

  selectOptions: ISelectOptions;
  selectValues: ISelectValues;
  secValid = false;
  cdn = environment.cdn;
  portabilityForm: FormGroup;
  maxLines = 0;
  quantityPhones = 0;
  selectedCheck = false;
  validatePortabilityFlag = false;
  showHeadOmission = true;
  linesOmitted = [];
  totalLines: number;
  totalSelected: number;
  showCheckparent: boolean;
  totalFormsMinLength: number;
  omissionTitle: string;
  omissionCauses: string[];
  omitted: { id: number; description: string };
  supervisorAccount: string;
  numbersForOmission: string[];

  constructor(
    private dialogService: DialogService,
    public presenter: PortabilityPresenter,
    private fb: FormBuilder,
    private errorService: CRMErrorService,
  ) {}

  ngOnInit() {
    this.initForm();
    this.getMaxlines();
    if (this.isCAC && !this.virtualOfficeTypeFlag) {
      this.getCausesForOmmission();
    }
  }

  async omissionModal() {
    const dataReceived = await this.dialogService.open(
      SupervisorAuthComponent,
      {
        data: {
          option: EAuthSupervisor.PinOmission,
          operationType: this.saleOperationType,
          titleOmision: this.omissionTitle,
          causesOmission: this.omissionCauses,
        },
      },
    );
    if (dataReceived) {
      this.omitted = dataReceived[0];
      this.supervisorAccount = dataReceived[1];
      const linesOmitted = [];
      this.lines.controls.forEach((line: FormGroup, index: number) => {
        if (line.getRawValue().check) {
          linesOmitted.push(index);
        }
      });
      this.linesOmitted = linesOmitted;
      setTimeout(() => (this.linesOmitted = null), 1000);
      if (linesOmitted.length > 0) {
        this.showHeadOmission = false;
      } else {
        this.showHeadOmission = true;
      }
    }
  }

  setChecked() {
    this.totalLinesInfo();
    this.countLinesOmission();
  }

  setAllChecked(data: boolean) {
    this.lines.controls.forEach((line: FormGroup) => {
      line.controls.check.setValue(data);
    });
    this.totalLinesInfo();
    this.countLinesOmission();
  }

  countLinesOmission() {
    this.quantityPhones = this.lines.value.filter(
      resp => resp.check === true,
    ).length;
    setTimeout(
      () =>
        (this.quantityPhones = this.lines.value.filter(
          resp => resp.check === true,
        ).length),
      1,
    );
  }

  totalLinesInfo() {
    this.numbersForOmission = this.lines.value
      .filter(resp => resp.check === true)
      .map(resp => resp.phoneNumber);

    this.totalSelected = this.numbersForOmission.length;
    this.showCheckparent = this.totalLines === this.totalSelected;
  }

  invalidsForms() {
    this.showCheckparent = false;
    this.invalidFormsMinLength();
    this.countLinesOmission();
  }

  invalidFormsMinLength() {
    this.totalFormsMinLength = this.lines.value.filter(
      resp => resp.phoneNumber.length < 9,
    ).length;
  }

  deleteChange(change: boolean) {
    console.log("Cambio",change);
    if(change){
      this.invalidsForms();
      if (this.totalLines >= 0 ) {
        this.showHeadOmission = true;
      } 
    }
  }

  again() {
    this.addLine();
    this.getMaxlines();
  }

  async getMaxlines() {
    this.error = null;
    const response = await this.presenter.getMaxlines(
      this.user,
      this.customer,
      this.saleOperationType,
    );
    if (response) {
      this.maxLinesService.emit(response);
      this.maxLines = response.quantityLinesAllowed;
      if (this.maxLines === 0) {
        this.lines.removeAt(0);
        this.error = this.errorService.showFunctionalError('CRM-941');
      }
    } else {
      this.lines.removeAt(0);
      this.error = this.presenter.error;
    }
  }

  get formLines() {
    return this.portabilityForm.controls;
  }

  get lines() {
    return this.formLines.lines as FormArray;
  }

  initForm() {
    this.selectOptions = {
      cboServices: [],
      cboOperators: [],
      cboModOrigins: [],
    };
    this.selectValues = {
      cboService: null,
      cboOperator: null,
    };
    this.portabilityForm = this.fb.group({
      lines: new FormArray([]),
    });
    this.addLine();
  }

  createLineForm(): FormGroup {
    return this.fb.group({
      check: false,
      cboService: [this.selectValues.cboService, Validators.required],
      cboOperator: [this.selectValues.cboOperator, Validators.required],
      cboModOrigin: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('9[0-9]{8}')]],
      saleOptions: null,
      activationDate: null,
      sequentialCode: null,
      due: null,
      ready: false,
    });
  }

  unreadyToSec(): boolean {
    return (
      this.lines.length &&
      this.lines.controls.some(line => line.get('ready').value !== true)
    );
  }

  addLine() {
    this.presenter.error = null;
    this.lines.push(this.createLineForm());
    this.totalLines = this.lines.controls.length;
    this.totalLinesInfo();
    this.invalidFormsMinLength();
  }

  lineRemoved(i: number) {
    this.presenter.error = null;
    this.totalLines--;
    this.totalLinesInfo();
  }

  async generateSec() {
    const portability = await this.presenter.portabilityValidate(
      this.user,
      this.customer,
      this.saleOperationType,
      this.lines,
    );
    if (portability) {
      const declarations = await this.dialogService.open(
        DeclarationKnowledgeComponent,
      );
      if (declarations) {
        const secNumber = await this.presenter.generateSec(
          this.user,
          this.customer,
          this.lines,
          declarations,
          this.omitted,
          this.numbersForOmission,
          this.supervisorAccount,
        );
        if (secNumber) {
          this.secValid = true;
          this.resolveStep.emit(EStepNav.next);
          this.linesSec.emit(this.presenter.getLines(this.lines));
          this.secNumber.emit(secNumber);
        }
      }
    }
  }

  async getCausesForOmmission() {
    const omission = await this.presenter.getCausesForOmmission(
      this.user,
      this.lines,
    );
    this.omissionTitle = omission.title;
    this.omissionCauses = omission.causes;
  }
}
