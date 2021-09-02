import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EInputValidation } from '@claro/commons';
import { MemoryStorage, SessionStorage } from '@claro/commons/storage';
import {
  BiometricBody,
  ECustomerDocument,
  ErrorResponse,
  SnackbarService,
} from '@claro/crm/commons';
import { Router } from '@angular/router';
import { RegisterPresenter } from './register.presenter';
import { AuthService, User } from '@shell/app/core';
import {
  ECriteriaType,
  PortabilityParam,
  Seller,
  SellerStatus,
  EAuthenticationType,
} from '@sellers/app/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.view.html',
  styleUrls: ['./register.view.scss'],
  providers: [RegisterPresenter],
})
export class RegisterComponent implements OnInit, OnDestroy {
  sellersForm: FormGroup;
  responseMessage: string;
  inputType: EInputValidation;
  messageRequiredItem = 'Campo obligatorio';
  messageRequiredEmail = 'El correo ingresado es invalido';
  messageRequiredNumber = '';
  maxLength: number;
  selectValue = '';
  valueDocument: any;
  isLoading: boolean;
  customerPresenter: any;
  onViewError = true;
  error: ErrorResponse;
  showPageError: boolean;
  type: string;
  user: User;
  isValidPhoneService = false;
  scanBiometric: boolean;
  biometricAttemptsNumber: number;
  sellers: Seller;
  editUser: Seller;
  optionsStatus: PortabilityParam[];
  btnLabel: string;
  scanSuccess: boolean;
  onMessage: boolean;
  phone: string;
  statusType = SellerStatus;
  configurationDocType: {
    documentType: string;
    phoneNumber: boolean;
    biometric: boolean;
    pin: boolean;
    account: boolean;
  };
  disablesInputScan: boolean;
  inactiveCreate: boolean;
  inactiveCreateButton: boolean;
  flagBio: boolean;
  successfulBiometric: boolean;
  omissionRequired: boolean;
  flagScan: boolean;
  omissionMessage: string;
  biometricBody: BiometricBody;
  errorBiometric: ErrorResponse;
  biometricType: string;
  IDTError: boolean;
  isSellersNoBiometric: boolean;

  constructor(
    private fb: FormBuilder,
    private memory: MemoryStorage,
    private authService: AuthService,
    public presenter: RegisterPresenter,
    private router: Router,
    private snackbar: SnackbarService,
    private sessionStorage: SessionStorage,
  ) {
    this.createForm();
    this.user = this.authService.getUser();
    this.editUser = this.sessionStorage.get('seller-edit-data');
    this.omissionRequired = false;
    this.omissionMessage =
      'Debes validar la identidad del vendedor para poder continuar con el flujo';
    this.inactiveCreateButton = true;
    this.biometricType = 'sellers';
    this.isSellersNoBiometric = false;
  }

  async ngOnInit() {
    this.getBiometricConfig();
    if (!this.editUser) {
      await this.presenter.getnetworkAccount();
    } else{
      this.isValidPhoneService = true;
    }
    this.useDataUser();
    this.getCboSellers();
    this.valueDocument = this.memory.get('searchValues');
    if (this.valueDocument?.criteriaId === ECriteriaType.DOCUMENT) {
      this.selectValue = this.valueDocument.documentTypeId;
      this.sellersForm.get('documentType').setValue(this.selectValue);
      this.sellersForm
        .get('documentNumber')
        .setValue(this.valueDocument.searchText);
      this.sellersForm.updateValueAndValidity();
    }
    this.scanBiometric = true;
    this.biometricAttemptsNumber = this.user.seller.configurations.biometricAttemptsNumber;
    this.scanSuccess = false;
    this.IDTError = false;
  }

  getBiometricConfig() {
    this.presenter.getBiometricConfig(this.user.office);
  }

  getCboSellers() {
    this.presenter.getCboSellers().then((options: PortabilityParam[]) => {
      this.optionsStatus = options;
      if (this.optionsStatus && this.optionsStatus.length) {
        const defaultStatus = this.optionsStatus.find(
          element => element.label === 'Activo',
        );
        if (defaultStatus) {
          this.sellersForm.get('status').setValue(defaultStatus.value);
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/vendedores/busqueda']);
  }

  biometricScanEmit(data) {
    setTimeout(() => {
      this.scanSuccess = data.success;
    }, 3000);
    this.scanSuccessData(data);
  }

  leaveReceived() {
    window.history.back();
  }

  useDataUser() {
    if (this.editUser) {
      this.presenter.accounts = [
        {
          value: this.editUser.account,
          label: this.editUser.account,
        },
      ];
      this.sellersForm
        .get('account')
        .setValue(this.presenter.accounts[0].value);
      this.sellersForm.get('pointSeller').setValue(this.editUser.pointSale);
      if (
        this.editUser.account &&
        this.editUser.status !== this.statusType.Inactive
      ) {
        this.btnLabel = 'Actualizar Vendedor';
        this.sellersForm.get('status').setValue(this.editUser.status);
      } else {
        this.btnLabel = 'Crear Vendedor';
        this.sellersForm.get('status').setValue(this.statusType.Active);
      }
      this.sellersForm.get('documentType').setValue(this.editUser.documentType);
      this.sellersForm
        .get('documentNumber')
        .setValue(this.editUser.documentNumber);
      this.sellersForm.get('names').setValue(this.editUser.names);
      this.sellersForm.get('lastName').setValue(this.editUser.lastName);
      this.sellersForm
        .get('motherLastName')
        .setValue(this.editUser.motherLastName);
      this.sellersForm.get('email').setValue(this.editUser.email);
      this.sellersForm.get('emailConfirm').setValue(this.editUser.email);
      this.sellersForm.get('phone').setValue(this.editUser.phone);
    } else {
      this.sellersForm.get('pointSeller').setValue(this.user.officeDescription);
      this.sellersForm.get('status').setValue(this.statusType.Active);
      this.btnLabel = 'Crear Vendedor';
    }
    this.sellersForm.updateValueAndValidity();
  }

  get formControlPhone() {
    return this.sellersForm.get('phone') as FormControl;
  }

  private isValidPhone() {
    return this.sellersForm.valid && !!this.formControlPhone.value;
  }

  changePhoneNumber() {
    this.isValidPhoneService = false;
  }

  handleEnterForInput() {
    if (this.isValidPhone()) {
      const body = {
        phoneNumber: this.formControlPhone.value,
        documentType: this.sellersForm.get('documentType').value,
        documentNumber: this.sellersForm.get('documentNumber').value,
      };
      if (
        (this.configurationDocType && this.configurationDocType.phoneNumber) ||
        this.editUser
      ) {
        this.validatePhone(body);
      } else {
        this.isValidPhoneService = true;
      }
    }
  }

  async validatePhone(event: any) {
    const response = await this.presenter.getValidatePhone(event);
    if (response) {
      this.inactiveCreate = false;
      this.isValidPhoneService = true;
      this.messageRequiredNumber = '';
    } else {
      this.sellersForm.get('phone').reset();
      this.messageRequiredNumber = this.presenter.errorPhone;
      this.isValidPhoneService = false;
    }
  }

  async updateSellers(event: any) {
    const response = await this.presenter.putRegisterSellers(event);
    this.onViewError = false;
    if (response) {
      this.onMessage = response;
    }
  }

  async registerSellers(event: any) {
    const response = await this.presenter.postRegisterSellers(event);
    this.onViewError = false;
    if (response) {
      this.onMessage = response;
    }
  }

  async onSubmit() {
    this.phone = '******' + this.sellersForm.get('phone').value.substr(-3);
    if (this.editUser && this.editUser.status !== this.statusType.Inactive) {
      const body = {
        officeCode: this.user.office,
        documentType: this.sellersForm.get('documentType').value,
        documentNumber: this.sellersForm.get('documentNumber').value,
        status: this.sellersForm.get('status').value,
        email: this.sellersForm.get('email').value,
        phone: this.sellersForm.get('phone').value,
        author: this.user.account,
        incapacity: 0,
      };
      this.updateSellers(body);
    } else {
      const body = {
        officeCode: this.user.office,
        account: this.sellersForm.get('account').value,
        documentType: this.sellersForm.get('documentType').value,
        documentNumber: this.sellersForm.get('documentNumber').value,
        names: this.sellersForm.get('names').value,
        firstName: this.sellersForm.get('lastName').value,
        secondName: this.sellersForm.get('motherLastName').value,
        email: this.sellersForm.get('email').value,
        phone: this.sellersForm.get('phone').value,
        authentication:
          this.type === ECriteriaType.DNI
            ? EAuthenticationType.BIO
            : EAuthenticationType.PIN,
        author: this.user.account,
        incapacity: '0',
      };
      this.registerSellers(body);
    }
  }

  register() {
    this.onViewError = true;
  }

  search() {
    this.router.navigate(['/vendedores']);
  }

  createForm() {
    this.sellersForm = this.fb.group(
      {
        pointSeller: ['', Validators.required],
        account: ['', Validators.required],
        documentType: ['', Validators.required],
        documentNumber: ['', Validators.required],
        status: ['', Validators.required],
        names: ['', Validators.required],
        lastName: ['', Validators.required],
        motherLastName: ['', Validators.required],
        email: ['', [Validators.email]],
        emailConfirm: ['', [Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('[0-9]{9,9}')]],
      },
      { validator: this.MustMatch('email', 'emailConfirm') },
    );
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  changeDocumentNumber(documentNumber: string) {
    if (this.sellersForm.get('documentNumber').valid) {
      this.getBiometricBody();
    }
  }

  getBiometricBody() {
    this.biometricBody = {
      person: this.sellersForm.value,
      errorSale: this.presenter.errorSale,
      scanBiometric: this.scanBiometric,
      flagBio: this.flagBio,
      user: this.user,
      limitBiometricAttempts: this.biometricAttemptsNumber,
      omissionRequired: this.omissionRequired,
      orderNumber: '',
    };
  }

  changeDocType(documentType: string) {
    this.type = documentType;
    this.configurationDocType = this.user.seller.configurations.documentTypeValidations.find(
      value => value.documentType === this.type,
    );

    this.inactiveCreate = false;
    this.inactiveCreateButton = true;
    if (this.configurationDocType && !this.configurationDocType.phoneNumber) {
      this.isValidPhoneService = true;
    }
    this.sellersForm.get('documentNumber').setValue('');
    this.sellersForm.get('documentNumber').clearValidators();
    switch (documentType) {
      case ECustomerDocument.DNI:
        this.maxLength = 8;
        this.inputType = EInputValidation.Number;
        this.sellersForm
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[0-9]{8,8}'),
          ]);
        break;
      case ECustomerDocument.CIP:
        this.maxLength = 10;
        this.inputType = EInputValidation.Alphanumeric;
        this.sellersForm
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]{5,12}'),
          ]);
        break;
      case ECustomerDocument.CE:
      case ECustomerDocument.PASAPORTE:
      case ECustomerDocument.CPP:
        this.maxLength = 12;
        this.inputType = EInputValidation.Alphanumeric;
        this.sellersForm
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]{5,12}'),
          ]);
        break;
      default:
        this.maxLength = 15;
        this.inputType = EInputValidation.Alphanumeric;
        this.sellersForm
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]{5,15}'),
          ]);
    }
    this.sellersForm.get('documentNumber').markAsUntouched();
    this.sellersForm.get('documentNumber').updateValueAndValidity();
    if (
      !this.configurationDocType.account &&
      !this.configurationDocType.biometric &&
      !this.configurationDocType.pin
    ) {
      this.inactiveCreate = true;
      this.inactiveCreateButton = true;
      this.snackbar.show(
        'Para este tipo de documento no está permitido crear vendedor',
        'error',
      );
    }
  }

  errorReceived(error: ErrorResponse) {
    this.errorBiometric = error;
    const IDTError = error?.code.substring(0, 3) === 'IDT' ? true : false;
    if (IDTError) {
      setTimeout(() => {
        this.IDTError = true;
      }, 3000);
    }
  }

  isSellersNoBiometricReceived(isSellersNoBiometric: boolean) {
    this.isSellersNoBiometric = isSellersNoBiometric;
  }

  scanSuccessData(data) {
    if (data.success) {
      this.sellersForm.get('email').reset();
      this.sellersForm.get('emailConfirm').reset();
      this.sellersForm.get('phone').reset();
      setTimeout(() => {
        this.scanSuccess = data.success;
        this.disablesInputScan = true;
        this.sellersForm.get('names').setValue(data.person.name);
        this.sellersForm.get('lastName').setValue(data.person.firstName);
        this.sellersForm.get('motherLastName').setValue(data.person.secondName);
        this.sellersForm.updateValueAndValidity();
      }, 3000);
    } else {
      if (
        this.errorBiometric.code === 'CRM-977' &&
        (this.configurationDocType.account || this.configurationDocType.pin)
      ) {
        this.sellersForm.get('names').reset();
        this.sellersForm.get('lastName').reset();
        this.sellersForm.get('motherLastName').reset();
        this.sellersForm.get('email').reset();
        this.sellersForm.get('emailConfirm').reset();
        this.sellersForm.get('phone').reset();
        setTimeout(() => {
          this.scanSuccess = !data.success;
        }, 3000);
      }
    }
  }

  ngOnDestroy() {
    this.sessionStorage.remove('seller-edit-data');
    this.editUser = undefined;
  }
}
