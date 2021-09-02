import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ErrorResponse, Pin, CRMErrorService } from '@claro/crm/commons';
import { User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-pin-step',
  templateUrl: './pin-step.component.html',
  styleUrls: ['./pin-step.component.scss'],
})
export class PinStepComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() pin: Pin;
  @Input() pinStatus: boolean;
  @Input() maxValidations: boolean;
  @Input() error: ErrorResponse;
  @Output() sent = new EventEmitter<{}>();
  @Output() submitted = new EventEmitter<{}>();
  form: FormGroup;
  cdn = environment.cdn;
  resend = '';
  phone: string;
  isFirstTime = true;
  pinMessage: string;
  isSending = false;
  isCountdownOver = false;
  pinTimer = 30;
  pinMaxLength = 5;

  constructor(
    private formBuilder: FormBuilder,
    private errorService: CRMErrorService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      phoneNumberCode: [
        '',
        [
          Validators.required,
          Validators.pattern(`[a-zA-Z0-9]{${this.pinMaxLength}}`),
        ],
      ],
    });
    this.pinStatus = null;
    this.phone = '*******' + this.user.phone.substr(-2);
  }

  ngOnChanges() {
    if (this.pinStatus) {
      this.isSending = false;
      this.isCountdownOver = false;
      if (!this.isFirstTime) {
        this.resend = 're';
      }
      this.pinTimer = this.pin.timerModalWindow;
      this.pinMaxLength = this.pin.numberDigits;
      if (this.form) {
        this.form.controls.phoneNumberCode.setValidators([
          Validators.required,
          Validators.pattern(`[a-zA-Z0-9]{${this.pinMaxLength}}`),
        ]);
        this.form.updateValueAndValidity();
      }
    }

    if (this.error && this.error.code !== 'IDFF4') {
      this.isCountdownOver = true;
      if (this.maxValidations) {
        this.form.reset();
      }
    }
  }

  sendPin() {
    this.form.reset();
    this.isSending = true;
    this.isFirstTime = false;
    this.sent.emit();
  }

  countdownOver() {
    this.isCountdownOver = true;
    this.form.reset();
    this.error = this.errorService.showFunctionalError('CRM-957');
  }

  onChangeInput() {
    this.error = null;
  }

  onSubmit() {
    const body = {
      sendSMSPin: (this.pin && this.pin.sendSMSPin) || '',
      phoneNumberCode: this.form.value.phoneNumberCode,
      userAccount: this.user.account,
    };
    this.submitted.emit(body);
  }
}
