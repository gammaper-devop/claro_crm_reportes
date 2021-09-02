import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';

import { User, AuthService } from '@shell/app/core';
import { LoginService } from '@customers/app/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CRMErrorService, ErrorCodes, ErrorResponse } from '@claro/crm/commons';
import { EErrorCode } from 'libs/crm-commons/src/enums';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  @Input() error: ErrorResponse;
  @Output() viewLogin = new EventEmitter<{}>();
  @Output() userUpdate = new EventEmitter<{}>();
  user: User;
  form: FormGroup;
  maxAttempts = false;
  accountBlockedFlag: boolean;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private errorService: CRMErrorService,
  ) {
    this.accountBlockedFlag = false;
    this.user = this.authService.getUser();
    this.form = this.fb.group({
      application: '227',
      userAccount: this.user.account,
      officeSale: this.user.office,
      documentVendor: ['', [Validators.required, Validators.minLength(8)]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]{2}'),
          Validators.minLength(2),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitIdentification(this.form.value);
    }
  }

  async submitIdentification(body: any) {
    this.error = null;
    try {
      const response = await this.loginService.validateIdentification(body);
      this.user.nameVendor = response.nameVendor;
      this.user.documentVendor = body.documentVendor;
      this.viewLogin.emit(false);
      this.userUpdate.emit(this.user);
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-903',
      );
      if (this.error.code === EErrorCode.IDFF1) {
        this.maxAttempts = true;
      }
      if (this.error.code === EErrorCode.IDFF4) {
        this.accountBlockedFlag = true;
      }
    }
  }

  accountChange(data: string) {
    this.form.controls.password.reset();
    this.onChangeInput();
  }

  onChangeInput() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.form.reset();
  }
}
