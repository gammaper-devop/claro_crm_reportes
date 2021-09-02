import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorResponse } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-account-step',
  templateUrl: './account-step.component.html',
  styleUrls: ['./account-step.component.scss'],
})
export class AccountStepComponent {
  @Input() error: ErrorResponse;
  @Output() submitted = new EventEmitter<{}>();
  form: FormGroup;
  cdn = environment.cdn;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      application: '227',
      userAccount: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  accountChange(data: string) {
    this.form.controls.password.reset();
    this.onChangeInput();
  }

  onChangeInput() {
    this.error = null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitted.emit(JSON.parse(JSON.stringify(this.form.value)));
    }
  }
}
