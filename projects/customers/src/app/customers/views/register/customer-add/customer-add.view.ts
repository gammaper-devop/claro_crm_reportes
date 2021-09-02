import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from '@angular/forms';

import { EInputValidation, UTILS } from '@claro/commons';
import {
  DocumentType,
  ErrorResponse,
  ECustomerDocument,
  Generics,
  Office,
  CRMGenericsService,
  EUserDocument,
} from '@claro/crm/commons';
import {
  Department,
  District,
  ECriteriaType,
  Province,
} from '@customers/app/core';
import { filter } from 'rxjs/operators';
import { CustomerAddPresenter } from './customer-add.presenter';
import { MemoryStorage } from '@claro/commons/storage';
import { Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { IParameter } from '@contracts/app/core';
import { RegisterPresenter } from '../register.presenter';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-customeradd',
  templateUrl: './customer-add.view.html',
  styleUrls: ['./customer-add.view.scss'],
  providers: [CustomerAddPresenter, RegisterPresenter],
})
export class CustomerAddComponent implements OnInit, OnChanges {
  @Input() error: ErrorResponse;
  @Input() documentTypes: DocumentType[];
  @Input() nationalities: Generics[];
  @Input() maritalStatus: Generics[];
  @Input() genders: Generics[];
  @Output() sendCustomer = new EventEmitter<{}>();
  customerForm: FormGroup;
  isPeruvian: boolean;
  messageRequiredItem = 'Campo obligatorio';
  messageRequiredEmail = 'El correo ingresado es invalido';
  messageRequiredDate = 'Campo obligatorio';
  flagBirthdate = false;
  flagInValidDate = false; 
  responseMessage: string;
  maxLength = 8;
  inputType: EInputValidation;
  minDate: Date;
  maxDate: Date;
  peruCode = '154';
  allNationalities: Generics[];
  filteredDepartments: Observable<Department[]>;
  filteredProvinces: Observable<Province[]>;
  filteredDistricts: Observable<District[]>;
  filteredNationalities: Observable<Generics[]>;
  filteredMaritalStatus:Observable<Generics[]>;
  filteredGenders:Observable<Generics[]>;
  filteredDocuments:Observable<DocumentType[]>
  departmentSelectedFlag: boolean;
  nationalityDisable: boolean;
  documentTypeDisable: boolean;

  private isLoading = false;
  valueDocument: any;
  selectValue = '';
  office: Office;

  constructor(
    private fb: FormBuilder,
    private customerPresenter: CustomerAddPresenter,
    private memory: MemoryStorage,
    public genericsService: CRMGenericsService,
    public presenter: CustomerAddPresenter,
    public registerPresenter: RegisterPresenter
  ) {
    this.createForm();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minDate = new Date(currentYear - 100, currentMonth, currentDay);
    this.maxDate = new Date(currentYear - 18, currentMonth, currentDay);
    this.office = this.genericsService.getOfficeDetail();
    this.departmentSelectedFlag = false;
    this.nationalityDisable = false;
    this.documentTypeDisable = false;
  }

  get f() {
    return this.customerForm.controls;
  }

  async ngOnInit() {

    await this.presenter.getDepartments();
 
    await this.registerPresenter.getGenerics();

    this.allNationalities = this.registerPresenter.nationalities;
    this.genders = this.registerPresenter.genders;
    this.maritalStatus = this.registerPresenter.maritalStatus.sort(function (a, b){
        return a.label.localeCompare(b.label, 'en', { numeric: true })
    });;
    if (this.office?.departmentCode) {
      const coincidence = this.presenter.departments.find(
        element => element.value === this.office.departmentCode
      );
      this.customerForm.get('department').setValue(
        { label: coincidence.label, value: this.office.departmentCode }
      );
      this.departmentSelected({label: '', value: this.office.departmentCode});
    }
    this.valueDocument = this.memory.get('searchValues');
    if (this.valueDocument?.criteriaId === ECriteriaType.DOCUMENT) {
      this.selectValue = this.valueDocument.documentTypeId;
      this.customerForm.get('documentType').setValue(this.selectValue);
      this.customerForm
        .get('documentNumber')
        .setValue(this.valueDocument.searchText);
      this.customerForm.updateValueAndValidity();
    }
    if  (this.selectValue) {
      const findDoc = this.documentTypes.find(
        document => document.value === this.selectValue
      );
      this.customerForm.get('documentType').setValue(
        { label: findDoc.label, value: findDoc.value}
      );
      this.documentTypeDisable = true;
    }
    if (this.selectValue === ECustomerDocument.DNI) {
      this.customerForm.get('nationality').setValue(
        { label: 'Peru', value: this.peruCode, cboKey: 'CBO_NATIONALITY' }
      );
      this.nationalityDisable = true;
    }
    else {
      this.verifyNationality(this.selectValue);
    }
    
    this.filteredDepartments = this.customerForm.controls.department.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.label),
      map(label => label ? this.filter(label, this.presenter.departments) : this.presenter.departments.slice())
    );

    this.filteredNationalities = this.customerForm.controls.nationality.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.label),
      map(label => label ? this.filter(label, this.nationalities) : this.nationalities?.slice())
    );

    this.filteredMaritalStatus = this.customerForm.controls.maritalStatus.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.label),
      map(label => label ? this.filter(label, this.maritalStatus) : this.maritalStatus?.slice())
    )

    this.filteredGenders = this.customerForm.controls.sex.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.label),
      map(label => label ? this.filter(label, this.genders) : this.genders?.slice())
    )

    this.filteredDocuments = this.customerForm.controls.documentType.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.label),
      map(label => label ? this.filter(label, this.documentTypes) : this.documentTypes.slice())
    );

  }

  ngOnChanges() {
    if (this.nationalities && this.selectValue === ECustomerDocument.CE) {
      this.verifyNationality(this.selectValue);
    }
  }

  async departmentSelected(event: Department) {
    await this.presenter.getProvinces(event.value);
    this.filteredProvinces = this.customerForm.get('province').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.label),
        map(label => label ? this.filter(label, this.presenter?.provinces) : this.presenter?.provinces.slice())
      );
  }

  async provinceSelected(event: Province) {
    const parameters = {
      departmentCode: this.customerForm.value.department.value,
      provinceCode: event.value,
    };
    await this.presenter.getDistricts(parameters);
    this.filteredDistricts = this.customerForm.get('district').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.label),
        map(label => label ? this.filter(label, this.presenter.districts) : this.presenter.districts.slice())
      );
  }

  inputDepartment() {
    this.customerForm.get('province').setValue('');
    this.customerForm.get('district').setValue('');
    this.presenter.provinces = [];
    this.presenter.districts = [];
  }

  blurDepartment() {
    let departmentValue = '';
    setTimeout(() => {
      if (typeof this.customerForm.get('department').value === 'string') {
        departmentValue = this.customerForm.get('department').value.toLowerCase();
        const coincidence = this.presenter.departments.some(
          element => element.label.toLowerCase() === departmentValue
        );
        if (!coincidence) {
          this.customerForm.get('department').setValue('');
        }
      }
    }, 500);
  }

  blurDocumentType() {
    this.setDocumentType();
  }

  enterDocumentType(event){
    this.setDocumentType();
  }

  setDocumentType(){
    let documentTypeValue = '';
    setTimeout(() => {
      if (typeof this.customerForm.get('documentType').value === 'string') {
        documentTypeValue = this.customerForm.get('documentType').value;
        const coincidence = this.documentTypes.some(
          element => element.label === documentTypeValue
        );
        if (!coincidence) {
          this.customerForm.get('documentType').setValue('');
        }
      }
    }, 100);
  }

  blurMaritalStatus() {
    this.setMaritalStatus();
  }

  enterMaritalStatus(event){
    this.setMaritalStatus();
  }

  setMaritalStatus(){
    let maritalValue = '';
    setTimeout(() => {
      if (typeof this.customerForm.get('maritalStatus').value === 'string') {
        maritalValue = this.customerForm.get('maritalStatus').value;
        const coincidence = this.maritalStatus.some(
          element => element.label === maritalValue
        );
        if (!coincidence) {
          this.customerForm.get('maritalStatus').setValue('');
        }
      }
    }, 100);
  }

  blurSex() {
    this.setSexStatus();
  }

  enterSex(event){
    this.setSexStatus();
  }

  setSexStatus(){
    let sexValue = '';
    setTimeout(() => {
      if (typeof this.customerForm.get('sex').value === 'string') {
        sexValue = this.customerForm.get('sex').value;
        const coincidence = this.genders.some(
          element => element.label === sexValue
        );
        if (!coincidence) {
          this.customerForm.get('sex').setValue('');
        }
      }
    }, 100);
  }

  inputProvince() {
    this.customerForm.get('district').setValue('');
    this.presenter.districts = [];
  }

  blurProvince() {
    let provinceValue = '';
    setTimeout(() => {
      if (typeof this.customerForm.get('province').value === 'string') {
        provinceValue = this.customerForm.get('province').value.toLowerCase();
        const coincidence = this.presenter.provinces.some(
          element => element.label.toLowerCase() === provinceValue
        );
        if (!coincidence) {
          this.customerForm.get('province').setValue('');
        }
      }
    }, 500);
  }

  blurDistrict() {
    let districtValue = '';
    setTimeout(() => {
      if (typeof this.customerForm.get('district').value === 'string') {
        districtValue = this.customerForm.get('district').value.toLowerCase();
        const coincidence = this.presenter.districts.some(
          element => element.label.toLowerCase() === districtValue
        );
        if (!coincidence) {
          this.customerForm.get('district').setValue('');
        }
      }
    }, 500);
  }

  blurNationality() {
    let nationalityValue = '';
    setTimeout(() => {
      if (typeof this.customerForm.get('nationality').value === 'string') {
        nationalityValue = this.customerForm.get('nationality').value.toLowerCase();
        const coincidence = this.nationalities.some(
          element => element.label.toLowerCase() === nationalityValue
        );
        if (!coincidence) {
          this.customerForm.get('nationality').setValue('');
        }
      }
    }, 500);
  }

  valueChanged(e) {
    console.log("E->Exception",e);
    const minDate = this.minDate;
    const maxDate = this.maxDate;
 
    if(!(e === null || e === undefined)){
      if (e>= minDate) {
        if (e <= maxDate) {
          console.log("The user is of legal age");
        } else {
          this.messageRequiredDate = "Debe ser mayor de edad";
          this.customerForm.get('birthdate').setValue('');
        }
      }
    }
    else if(isNullOrUndefined(e)){
      this.flagInValidDate = true;
      this.messageRequiredDate = "Formato de fecha inválida";
    }
    
    // if (e === '') {
    //   console.log("E->Exception 3",e);
    //   this.customerForm.controls.birthdate.reset();
    // }
  }

  private verifyNationality(documentType: string) {
    if (!this.allNationalities) {
      this.allNationalities = this.registerPresenter.nationalities;
    }
    if (documentType === ECustomerDocument.CE || 
      documentType === ECustomerDocument.PASAPORTE || 
      documentType === ECustomerDocument.CIP || 
      documentType === ECustomerDocument.CPP) {
      this.nationalities = this.allNationalities.filter(
        nationality => nationality.value !== this.peruCode,
      );
      if (this.customerForm.value.nationality === this.peruCode) {
        this.customerForm.get('nationality').setValue(null);
        // this.changeNationality('');
      }
    }  
    else if (documentType === EUserDocument.CIE || 
      documentType === EUserDocument.CIRE ||
      documentType === EUserDocument.CPP ||
      documentType === EUserDocument.CTM || 
      documentType === EUserDocument.PASAPORTE  ||
      documentType === EUserDocument.CE || 
      documentType === EUserDocument.CIP) {
      this.nationalities = this.allNationalities.filter(
        nationality => nationality.value !== this.peruCode,
      );
      if (this.customerForm.value.nationality === this.peruCode) {
        this.customerForm.get('nationality').setValue(null);
          // this.changeNationality('');
      }
    }
    else {
      this.nationalities = this.allNationalities;
    }
  }

  changeNationality(value: string) {
    // this.isPeruvian = value === this.peruCode;
    // this.updateValidator();
  }

  changeDocType(documentType: string) {
    this.customerForm.get('documentNumber').setValue('');
    this.customerForm.get('documentNumber').clearValidators();
    switch (documentType) {
      case ECustomerDocument.DNI:
        this.maxLength = 8;
        this.inputType = EInputValidation.Number;
        this.customerForm
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[0-9]{8,8}'),
          ]);
        break;
      case ECustomerDocument.CIP:
        this.maxLength = 10;
        this.inputType = EInputValidation.Alphanumeric;
        this.customerForm
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
        this.customerForm
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]{5,12}'),
          ]);
        break;
      default:
        this.maxLength = 15;
        this.inputType = EInputValidation.Alphanumeric;
        this.customerForm
          .get('documentNumber')
          .setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]{5,15}'),
          ]);
    }
    this.customerForm.get('documentNumber').markAsUntouched();
    this.customerForm.get('documentNumber').updateValueAndValidity();
    this.verifyNationality(documentType);
  }

  createForm() {
    this.customerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        paternalLastName: ['', [Validators.required]],
        maternalLastName: ['', [Validators.required]],
        documentType: ['', Validators.required],
        documentNumber: ['', Validators.compose([Validators.required])],
        nationality: ['', Validators.required],
        //maritalStatus: ['', Validators.required],
        maritalStatus: [''],
        sex: [''],//, Validators.required],
        birthdate: ['', Validators.required],//, Validators.required],
        birthplace: [''],// [Validators.required]],
        contactNumber: [
          '',
          [
            //Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
            Validators.pattern('[0-9]{9,9}'),
          ],
        ],
        email: [
          '',
          [
            Validators.email,
            Validators.pattern(
              '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}',
            ),
          ],
        ],
        emailConfirm: [
          '',
          [
            Validators.email,
            Validators.pattern(
              '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}',
            ),
          ],
        ],
        address: [''],// Validators.required],
        urbanization: [''],// Validators.required],
        postalCode: [''],
        district: [''],// Validators.required],
        province: [''],// Validators.required],
        department: [''],// Validators.required],
        references: [''],
      },
      { validator: this.MustMatch('email', 'emailConfirm') },
    );
  }

  onSubmit() {
    this.getFormValidationErrors();
    if (this.customerForm.valid) {
      const {
        name,
        paternalLastName,
        maternalLastName,
        documentNumber,
        documentType,
        nationality,
        maritalStatus,
        sex,
        birthplace,
        contactNumber,
        email,
        department,
        province,
        district,
        urbanization,
        address,
        postalCode,
        references,
      } = this.customerForm.controls;

      const newClient = {
        appCode: '227',
        name: name.value,
        firstName: paternalLastName.value,
        secondName: maternalLastName.value,
        documentNumber: documentNumber.value,
        documentType: documentType.value.value, //documentType.value
        documentTypeDescription:
          this.documentTypes.find(x => x.value === this.f.documentType.value.value)
            ?.label || '',
        nationalityCode: nationality.value.value,
        nationalityDescription: nationality.value.label || '',
        civilStatusCode: maritalStatus.value.value, //maritalStatus.value.value
        civilStatusDescription:
          this.maritalStatus.find(x => x.value === this.f.maritalStatus.value.value)
            ?.label || '',
        sexCode: sex.value.value, //sex.value
        sexDescription:
          this.genders.find(x => x.value === this.f.sex.value.value)
            ?.label || '',
        birthDate: UTILS.formatDate(this.customerForm.value.birthdate),
        placeBirth: birthplace.value,
        contactNumber: contactNumber.value,
        email: email.value,
        departmentCode: department.value.value,
        deparmentDescription: department.value.label || '',
        provinceCode: province.value.value,
        provinceDescription: province.value.label || '',
        districtCode: district.value.value,
        districtDescription: district.value.label || '',
        urbanization: urbanization.value,
        address: address.value,
        postalCode: postalCode.value,
        reference: references.value,
      };
      this.sendCustomer.emit(newClient);
    } else {
      this.markFormGroupTouched(this.customerForm);
    }
  }

  getFormValidationErrors() {
    Object.keys(this.customerForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.customerForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          if (key === 'emailConfirm' && keyError === 'mustMatch') {
            this.responseMessage = 'El email de confirmación no coincide';
          }
        });
      }
    });
  }

  updateValidator() {
    if (!this.isPeruvian) {
      this.customerForm
        .get('maritalStatus')
        .setValidators([Validators.required]);
      this.customerForm.get('sex').setValidators([Validators.required]);
      this.customerForm.get('birthdate').setValidators([Validators.required]);
      this.customerForm.get('birthplace').setValidators([Validators.required]);
      this.customerForm.get('address').setValidators([Validators.required]);
      this.customerForm
        .get('urbanization')
        .setValidators([Validators.required]);
      this.customerForm.get('postalCode');
      this.customerForm.get('district').setValidators([Validators.required]);
      this.customerForm.get('province').setValidators([Validators.required]);
      this.customerForm.get('department').setValidators([Validators.required]);
    } else {
      this.customerForm.get('maritalStatus').clearValidators();
      this.customerForm.get('sex').clearValidators();
      this.customerForm.get('birthdate').clearValidators();
      this.customerForm.get('birthplace').clearValidators();
      this.customerForm.get('address').clearValidators();
      this.customerForm.get('urbanization').clearValidators();
      this.customerForm.get('postalCode').clearValidators();
      this.customerForm.get('district').clearValidators();
      this.customerForm.get('province').clearValidators();
      this.customerForm.get('department').clearValidators();
    }
    this.customerForm.get('maritalStatus').updateValueAndValidity();
    this.customerForm.get('sex').updateValueAndValidity();
    this.customerForm.get('birthdate').updateValueAndValidity();
    this.customerForm.get('birthplace').updateValueAndValidity();
    this.customerForm.get('address').updateValueAndValidity();
    this.customerForm.get('urbanization').updateValueAndValidity();
    this.customerForm.get('postalCode').updateValueAndValidity();
    this.customerForm.get('district').updateValueAndValidity();
    this.customerForm.get('province').updateValueAndValidity();
    this.customerForm.get('department').updateValueAndValidity();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (Object.values(formGroup.controls) as any).forEach(control => {
      control.markAsTouched();    
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
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

  handlerFormChange(): void {
    this.customerForm
      .get('documentNumber')
      .valueChanges.pipe(
        filter(() => !this.isLoading),
        filter(() => this.customerForm.get('documentType').valid),
        filter(() => this.customerForm.get('documentNumber').valid),
      )
      .subscribe((value: string) => {
        this.validCustomerExist();
      });
  }

  async validCustomerExist() {
    let documentType = this.customerForm.get('documentType').value;
    const documentNumber = this.customerForm.get('documentNumber').value;
    const criteriaId = '01';

    if (documentType === '13') {
      documentType = '9';
    }

    const body = {
      criteriaId: criteriaId,
      searchText: documentNumber,
      documentTypeId: documentType,
    };

    this.isLoading = true;
    const customerExist = await this.customerPresenter.validCustomer(body);
    this.isLoading = false;

    if (customerExist) {
      this.resetFields();
    }
  }

  private filter(value: string, toFilter): any[] {
    const filterValue = value.toLowerCase();

    return toFilter.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(value: IParameter): string {
    return value && value.label ? value.label : '';
  }

  private resetFields(): void {
    this.customerForm.get('documentNumber').setValue(null);
  }
}
