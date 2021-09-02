import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorResponse, CRMErrorService } from '@claro/crm/commons';
import { LoginService, EAuthSupervisor } from '@customers/app/core';

@Component({
  selector: 'app-supervisor-auth',
  templateUrl: './supervisor-auth.component.html',
  styleUrls: ['./supervisor-auth.component.scss'],
})
export class SupervisorAuthComponent implements OnInit {
  error: ErrorResponse;
  form: FormGroup;
  supervisorUser: string;
  supervisorPassword: string;
  reasonsForm: any;
  lines: any;
  title: string;
  eAuthSupervisorReason: string;
  eAuthSupervisorLoyalty: string;
  eAuthSupervisorPinOmission: string;
  dataToSend: any[];

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private errorService: CRMErrorService,
    private dialogRef: MatDialogRef<SupervisorAuthComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      option: string;
      operationType: string;
      titleOmision: string;
      causesOmission: string[];
    },
  ) {
    this.supervisorUser = null;
    this.supervisorPassword = null;
    this.dataToSend = [];
    switch (this.data.option) {
      case EAuthSupervisor.Reason:
        this.title = 'Validación TG - Chip';
        break;
      case EAuthSupervisor.Loyalty:
        this.title = 'Validación de Fidelización';
        break;
      case EAuthSupervisor.PinOmission:
        this.title = 'Autorización';
        break;
      default:
        break;
    }
    this.eAuthSupervisorReason = EAuthSupervisor.Reason;
    this.eAuthSupervisorLoyalty = EAuthSupervisor.Loyalty;
    this.eAuthSupervisorPinOmission = EAuthSupervisor.PinOmission;
  }

  ngOnInit() {
    this.form = this.createAuthForm();
    if (
      this.data.option === this.eAuthSupervisorReason ||
      this.data.option === this.eAuthSupervisorLoyalty
    ) {
      this.form.get('pinOmission').disable();
    }
  }

  createAuthForm() {
    return this.fb.group({
      supervisorUser: ['', [Validators.required, Validators.minLength(6)]],
      supervisorPassword: ['', [Validators.required, Validators.minLength(6)]],
      pinOmission: ['', [Validators.required]],
    });
  }

  onChangeSupervisor(user: string) {
    this.form.controls.supervisorPassword.reset();
    this.supervisorUser = user;
  }

  onChangePassword(password: string) {
    this.error = null;
    this.supervisorPassword = password;
  }

  onRadioChange(i: number) {
    this.form.get('pinOmission').setValue(true);
    const omitted = {
      id: i + 1,
      description: this.data.causesOmission[i],
    };
    const supervisorAccount = this.supervisorUser;
    this.dataToSend.push(omitted, supervisorAccount);
  }

  async validateSupervisorAuth() {
    const body = {
      username: this.supervisorUser,
      password: this.supervisorPassword,
      operationType: this.data.operationType,
    };
    try {
      await this.loginService.validateSupervisorAuth(body);
      if (this.data.option === EAuthSupervisor.PinOmission) {
        this.dialogRef.close(this.dataToSend);
      } else {
        this.dialogRef.close(true);
      }
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-1000',
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
