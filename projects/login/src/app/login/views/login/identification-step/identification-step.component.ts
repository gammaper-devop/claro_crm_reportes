import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { EInputValidation } from '@claro/commons';
import { ErrorResponse, EUserDocument } from '@claro/crm/commons';
import { EChannel, User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';
import {} from '@shell/app/core';

@Component({
  selector: 'app-identification-step',
  templateUrl: './identification-step.component.html',
  styleUrls: ['./identification-step.component.scss'],
})
export class IdentificationStepComponent implements OnInit {
  @Input() error: ErrorResponse;
  @Input() documentTypes: any;
  @Input() user: User;
  @Output() submitted = new EventEmitter<{}>();
  form: FormGroup;
  showPin = false;
  cdn = environment.cdn;
  maxLength = 8;
  inputType: EInputValidation;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    let form = {
      userAccount: this.user.account,
      officeSale: this.user.office,
      channelCode: this.user.channel,
      documentType: [null, Validators.required],
      documentNumber: ['', [Validators.required]],
      userCode: this.user.userCode,
    };
    if (this.user.channel === EChannel.CAD) {
      form = {
        ...form,
        ...{
          pin: [
            '',
            [Validators.required, Validators.pattern('[a-zA-Z0-9]{2}')],
          ],
        },
      };
      this.showPin = true;
    }
    this.form = this.fb.group(form);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }

  onChangeTypeDoc(value: string) {
    this.error = null;
    this.form.get('documentNumber').setValue('');
    this.form.get('documentNumber').clearValidators();
    this.updateByDocumentType(value);
  }

  updateByDocumentType(documentType: string) {
    switch (documentType) {
      case EUserDocument.DNI:
        this.maxLength = 8;
        this.inputType = EInputValidation.Number;
        this.form
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[0-9]{8,8}'),
          ]);
        break;
      case EUserDocument.CE:
      case EUserDocument.PASAPORTE:
      case EUserDocument.CPP:
        this.maxLength = 12;
        this.inputType = EInputValidation.Alphanumeric;
        this.form
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]{5,12}'),
          ]);
        break;
      default:
        this.maxLength = 15;
        this.inputType = EInputValidation.Alphanumeric;
        this.form
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]{5,15}'),
          ]);
    }
    this.form.get('documentNumber').updateValueAndValidity();
  }

  onChangeInput() {
    this.error = null;
  }
}
