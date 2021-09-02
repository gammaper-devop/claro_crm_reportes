import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventBus } from '@claro/commons/event-bus';
import { ConfirmService, CRMErrorService, SnackbarService } from '@claro/crm/commons';
import { User } from '@shell/app/core';
import { Customer, PortabilityParam } from '@customers/app/core';
import { ISelectOptions, ISelectValues } from '../portability.interface';
import { AddLinePresenter } from './add-line.presenter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-line',
  templateUrl: './add-line.component.html',
  styleUrls: ['./add-line.component.scss'],
  providers: [AddLinePresenter],
})
export class AddLineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() formLine: FormGroup;
  @Input() parentForm: FormArray;
  @Input() selectOptions: ISelectOptions;
  @Input() selectValues: ISelectValues;
  @Input() secValid: boolean;
  @Input() user: User;
  @Input() isCAC: User;
  @Input() customer: Customer;
  @Input() index: number;
  @Input() saleOperationType: string;
  @Input() validatePortabilityFlag: boolean;
  @Output() lineRemoved: EventEmitter<number> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<boolean> = new EventEmitter();
  portabilityValid = false;
  sendPinValid = false;
  pinValid = false;
  pinValidLoading = false;
  resendPin = false;
  pinTimer = 30;
  pinMaxLength = 5;
  pin = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z0-9]{5}'),
  ]);
  countOver = false;
  @Output() checkEmit = new EventEmitter();
  @Output() checkAllEmit = new EventEmitter();
  @Input() showHeadOmission: boolean;
  changeChecked = false;
  @Input() linesOmitted: number[];
  @Input() showCheckparent: boolean;
  private messageBus$ = new Subscription();
  @Output() formsInvalidsEmit = new EventEmitter();
  @Input() totalFormsMinLength: number;
  @Input() virtualOfficeTypeFlag: boolean;
  phoneSelected = [];

  constructor(
    private eventBus: EventBus,
    private snackbarService: SnackbarService,
    private confirmService: ConfirmService,
    public presenter: AddLinePresenter,
    private errorService: CRMErrorService,
  ) {}

  get phone(): string {
    return this.formLine.controls.phoneNumber.value;
  }

  get totalLines(): number {
    return this.parentForm.controls.length;
  }

  ngOnInit() {
    if (this.index === 0) {
      this.getCboServices();
      this.getCboModOrigins();
    } else {
      this.eventBus.$on('editPortability', () => {
        this.formLine.get('cboService').setValue(this.selectValues.cboService);
        this.formLine
          .get('cboOperator')
          .setValue(this.selectValues.cboOperator);
        this.resetLine();
      });
    }
    this.presenter.calculateRetryPercentage(this.user);
  }

  ngOnChanges() {
    if (this.linesOmitted && this.linesOmitted.includes(this.index)) {
      this.portabilityValidateWithoutPin();
    }
  }

  ngOnDestroy() {
    this.messageBus$.unsubscribe();
  }

  selectedCheck(data: Event) {
    const input = data.target as HTMLInputElement;
    this.formLine.controls.check.setValue(input.checked);
    this.checkEmit.emit();
  }

  selectedAllCheck(data) {
    this.checkAllEmit.emit(data.target.checked);
  }

  getCboServices() {
    this.presenter.getCboServices().then((options: PortabilityParam[]) => {
      this.selectOptions.cboServices = options;
    });
  }

  getCboOperators(paramRequired: string) {
    this.presenter
      .getCboOperators(paramRequired)
      .then((options: PortabilityParam[]) => {
        this.selectOptions.cboOperators = options;
      });
  }

  getCboModOrigins() {
    this.presenter.getCboModOrigins().then((options: PortabilityParam[]) => {
      this.selectOptions.cboModOrigins = options;
    });
  }

  async validateAndSendPIN() {
    this.presenter.error = null;
    this.presenter.pinValidationsNumber = 0;
    this.presenter.maxValidations = false;
    this.countOver = false;
    this.sendPinValid = false;
    if (!this.phoneExists()) {
      await this.portabilityValidate();
      this.pin.reset();
      if (this.portabilityValid) {
        await this.sendPIN();
      }
    } else {
      this.presenter.error = this.errorService.showFunctionalError('CRM-953');
    }
  }

  async portabilityValidate() {
    if (!this.portabilityValid) {
      this.portabilityValid = false;
      this.portabilityValid = await this.presenter.PortabilityValidate(
        this.user,
        this.customer,
        this.saleOperationType,
        this.phone,
      );
    }
  }

  async portabilityValidateWithoutPin() {
    await this.portabilityValidate();
    if (this.portabilityValid) {
      this.omissionPin();
    }
  }

  async omissionPin() {
    this.pinValid = true;
    const priorConsultationConfig = this.user.configurations.find(
      config => config.key === 'priorConsultation',
    );
    if (priorConsultationConfig?.value === '1') {
      this.pinValidLoading = true;
      await this.priorConsultation();
      this.pinValidLoading = false;
      this.formLine.get('ready').setValue(false);
    } else {
      this.formLine.get('ready').setValue(true);
    }
  }

  async sendPIN() {
    if (!this.sendPinValid) {
      this.sendPinValid = await this.presenter.sendPIN(
        this.user,
        this.customer,
        this.phone,
      );
      if (this.sendPinValid) {
        this.pinTimer = this.presenter.pin.timerModalWindow;
        this.pinMaxLength = this.presenter.pin.numberDigits;
        this.pin.setValidators([
          Validators.required,
          Validators.pattern(`[a-zA-Z0-9]{${this.pinMaxLength}}`),
        ]);
        this.pin.updateValueAndValidity();
      }
    }
  }

  async validateSendPIN() {
    if (!this.pinValid) {
      this.pinValid = await this.presenter.validatePIN(
        this.user,
        this.pin.value,
      );
    }
    if (this.pinValid) {
      const priorConsultationConfig = this.user.configurations.find(
        config => config.key === 'priorConsultation',
      );
      if (priorConsultationConfig?.value === '1') {
        this.pinValidLoading = true;
        await this.priorConsultation();
        this.pinValidLoading = false;
        this.formLine.get('ready').setValue(false);
      } else {
        this.formLine.get('ready').setValue(true);
      }
    } else {
      if (this.presenter.error.code !== 'IDFF4') {
        this.sendPinValid = false;
        this.countOver = true;
        if (this.presenter.maxValidations) {
          this.resendPin = true;
          this.pin.reset();
        } else {
          this.resendPin = false;
        }
      }
    }
  }

  async priorConsultation() {
    return await this.presenter.priorConsultation(
      this.user,
      this.customer,
      this.formLine,
      this.phone,
    );
  }

  countdownOver() {
    this.sendPinValid = false;
    this.countOver = true;
    this.resendPin = true;
    this.presenter.error = this.errorService.showFunctionalError('CRM-957');
    this.pin.reset();
  }

  removeLine(index: number) {
    this.confirmService.open('deleteLinePortability').subscribe(response => {
      if (response) {
        this.lineRemoved.emit(index);
        this.parentForm.removeAt(index);
        if (this.parentForm.length === 0) {
          this.selectOptions.cboServices = [];
          this.selectOptions.cboOperators = [];
          this.selectOptions.cboModOrigins = [];
          this.selectValues.cboService = null;
          this.selectValues.cboOperator = null;
        }
        this.snackbarService.show('successDeleteLinePortability', 'success');
        this.deleteEvent.emit(true);
      }
    });
  }

  phoneExists() {
    return (
      this.parentForm.controls.filter(
        formGroup => formGroup.value.phoneNumber === this.phone,
      ).length > 1
    );
  }

  resetLine() {
    this.portabilityValid = false;
    this.sendPinValid = false;
    this.pinValid = false;
    this.pinValidLoading = false;
    this.resendPin = false;
    this.countOver = false;
    this.presenter.pinAttemptsNumber = 0;
    this.presenter.maxAttempts = false;
    this.presenter.pinValidationsNumber = 0;
    this.presenter.maxValidations = false;
    this.presenter.error = null;
    this.formLine.get('ready').reset();
  }

  onChangeService(item: PortabilityParam) {
    this.selectValues.cboService = item;
    if (this.index === 0) {
      this.eventBus.$emit('editPortability');
    }
    this.getCboOperators(item.value);
  }

  onChangeOperator(item: PortabilityParam) {
    this.selectValues.cboOperator = item;
    if (this.index === 0) {
      this.eventBus.$emit('editPortability');
    }
  }

  onChangeNumber() {
    this.presenter.error = null;
    this.formsInvalidsEmit.emit();
    if (this.formLine.value.check && !this.formLine.valid) {
      this.formLine.controls.check.setValue(false);
    }
  }
}
