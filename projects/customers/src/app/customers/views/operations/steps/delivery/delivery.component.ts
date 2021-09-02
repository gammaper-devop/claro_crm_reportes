import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DeliveryPresenter } from './delivery.presenter';
import { UTILS } from '@claro/commons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Delivery,
  Department,
  PaymentType,
  Province,
} from '@customers/app/core';
import { CRMGenericsService, Office } from '@claro/crm/commons';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  providers: [DeliveryPresenter],
})
export class DeliveryComponent implements OnInit {
  @Input() showDocumentsSign: boolean;
  @Input() virtualOfficeTypeFlag: boolean;
  @Output() sendDeliveryRequest = new EventEmitter<Delivery>();
  deliveryForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  messageRequiredItem: string;
  messageRequiredEmail: string;
  addressExtraInfo: boolean;
  idMaxlength: number;
  addressNumberInputDisable: boolean;
  deliveryRequest: Delivery;
  office: Office;
  suggestedDateSelected: Date;
  availableDateError: boolean;
  hidePaymentId: boolean;
  hidePaymentMode: boolean;
  suggestedDate = null;
  deliveryDate = null;
  classes: string[];

  constructor(
    private fb: FormBuilder,
    public presenter: DeliveryPresenter,
    public genericsService: CRMGenericsService,
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.messageRequiredItem = 'Campo obligatorio';
    this.messageRequiredEmail = 'El correo ingresado es inválido';
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, currentMonth, currentDay);
    this.office = this.genericsService.getOfficeDetail();
    this.availableDateError = false;
    this.hidePaymentId = true;
    this.hidePaymentMode = true;
  }

  async ngOnInit() {
    this.classes = ['w-100'];
    this.deliveryForm = this.createForm();
    this.addressExtraInfo = false;
    this.addressNumberInputDisable = false;
    await this.presenter.getAddressIdentifiers();
    await this.getDepartments();
    await this.presenter.getPaymentTypes();
    await this.presenter.getProviders();
    await this.presenter.getSuggestedDates();
    if (UTILS.isIE()) {
      this.markFormGroupTouched(this.deliveryForm);
    }
  }

  private createForm() {
    return this.fb.group({
      name: ['', [Validators.required]],
      contactNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern('[0-9]{9,9}'),
        ],
      ],
      email: [
        '',
        [
          Validators.pattern(
            '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}',
          ),
        ],
      ],
      addressIdentifier: ['', Validators.required],
      addressName: ['', Validators.required],
      addressNumber: '',
      addressWithoutNumberCheck: false,
      addressType: '',
      addressTypeName: '',
      addressLt: '',
      addressFull: ['', Validators.required],
      addressReference: '',
      district: ['', Validators.required],
      province: ['', Validators.required],
      department: ['', Validators.required],
      deliveryDate: '',
      suggestedDate: '',
      deliveryTimeRange: ['', Validators.required],
      paymentType: ['', Validators.required],
      paymentMode: '',
      paymentId: '',
      placementCall: ['', Validators.required],
      placementInOut: ['', Validators.required],
      deliveryDetails: '',
    });
  }

  async getDepartments() {
    await this.presenter.getDepartments();
    if (this.presenter.departments && this.presenter.departments.length) {
      const defaultDepartment = this.presenter.departments.find(
        department => department.value === this.office.departmentCode,
      );
      if (defaultDepartment) {
        this.deliveryForm.get('department').setValue(defaultDepartment);
        this.changeDepartment(defaultDepartment);
      }
    }
  }

  async changeAvailableDate(event: any) {
    const availabledate = event.value.toDate();
    this.availableDateError = false;
    let dateCoincidenceFlag = false;
    const suggestedDates = this.presenter.suggestedDates;
    this.presenter.error = null;
    this.presenter.firstAvailableDate = '';

    suggestedDates.forEach(item => {
      if (UTILS.formatDate(item.value) === UTILS.formatDate(availabledate)) {
        dateCoincidenceFlag = true;
      }
    });

    if (!dateCoincidenceFlag) {
      const response = await this.presenter.getAvailableDates(availabledate);
      if (response) {
        this.suggestedDateSelected = null;
        this.suggestedDate = null;
        this.deliveryForm.get('suggestedDate').setValue('');
        this.deliveryDate = availabledate;
      } else {
        this.deliveryDate = '';
        this.deliveryForm.get('deliveryDate').setValue('');
        this.deliveryForm.get('deliveryDate').reset();
        this.availableDateError = true;
      }
    } else {
      this.deliveryForm.get('suggestedDate').setValue('');
      this.deliveryDate = availabledate;
      this.suggestedDateSelected = null;
      this.suggestedDate = null;
    }
  }

  changeSuggestedDate(event: string) {
    this.presenter.error = null;
    this.presenter.firstAvailableDate = '';
    this.deliveryDate = '';
    this.deliveryForm.get('deliveryDate').reset();
    const dateSplit = event.split('/');
    const day = Number(dateSplit[0]);
    const month = Number(dateSplit[1]) - 1;
    const year = Number(dateSplit[2]);
    this.suggestedDate = event;
    this.suggestedDateSelected = new Date(year, month, day);
  }

  changeCheck(event: any) {
    if (event.checked) {
      this.addressExtraInfo = true;
      this.deliveryForm.get('addressNumber').setValue('S/N');
      this.addressNumberInputDisable = true;
    } else {
      this.addressExtraInfo = false;
      this.deliveryForm.get('addressNumber').reset();
      this.deliveryForm.get('addressType').reset();
      this.deliveryForm.get('addressTypeName').reset();
      this.deliveryForm.get('addressLt').reset();
      this.addressNumberInputDisable = false;
    }
  }

  changeProvince(event: Province) {
    const department = this.deliveryForm.get('department').value;
    this.presenter.error = null;
    this.presenter.getDistricts({
      departmentCode: department.value,
      provinceCode: event.value,
    });
  }

  changeDepartment(event: Department) {
    this.presenter.districts$ = null;
    this.presenter.error = null;
    this.presenter.getProvinces(event.value);
  }

  changePaymentType(event: PaymentType) {
    if (this.virtualOfficeTypeFlag && event.value === '1') {
      this.hidePaymentId = false;
      this.deliveryForm.get('paymentId').setValidators(Validators.required);
    } else {
      this.hidePaymentId = true;
      this.deliveryForm.get('paymentId').clearValidators();
    }
    if (this.virtualOfficeTypeFlag && event.value !== '2') {
      this.hidePaymentMode = false;
      this.deliveryForm.get('paymentMode').setValidators(Validators.required);
    } else {
      this.hidePaymentMode = true;
      this.deliveryForm.get('paymentMode').clearValidators();
    }
    this.deliveryForm.get('paymentMode').updateValueAndValidity();
    this.deliveryForm.get('paymentId').updateValueAndValidity();
    this.presenter.getPaymentMethods(event.value);
  }

  changePaymentMethods(event: PaymentType) {
    this.presenter.error = null;
    this.deliveryForm.get('paymentId').reset();
    this.idMaxlength = Number(event.idMaxlength);
  }

  resetForm() {
    this.deliveryForm.reset();
  }

  saveForm() {
    const delivery = this.deliveryForm.value;
    if (this.deliveryForm.valid) {
      this.deliveryRequest = {
        contactParameters: {
          name: delivery.name,
          contactNumber: delivery.contactNumber,
          email: delivery.email,
        },
        addressParameters: {
          addressIdentifier: delivery.addressIdentifier,
          addressName: delivery.addressName,
          addressNumber: delivery.addressNumber,
          addressFull: delivery.addressFull,
          addressReference: delivery.addressReference,
          addressWithoutNumberCheck: delivery.addressWithoutNumberCheck,
          addressType: delivery.addressType,
          addressTypeName: delivery.addressTypeName,
          addressLt: delivery.addressLt,
        },
        district: delivery.district,
        province: delivery.province,
        department: delivery.department,
        datesParameters: {
          deliveryTimeRange: delivery.deliveryTimeRange,
          selectedDate:
            this.presenter.firstAvailableDate ||
            this.suggestedDateSelected ||
            this.deliveryDate,
        },
        paymentParameters: {
          paymentType: delivery.paymentType,
          paymentMode: delivery.paymentMode,
          paymentId: delivery.paymentId,
        },
        placementParameters: {
          placementCall: delivery.placementCall,
          placementInOut: delivery.placementInOut,
        },
        deliveryDetails: delivery.deliveryDetails,
      };
      this.sendDeliveryRequest.emit(this.deliveryRequest);
    } else {
      this.markFormGroupTouched(this.deliveryForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (Object.values(formGroup.controls) as any).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  retry() {
    this.presenter.error = null;
    this.getDepartments();
    this.presenter.getAddressIdentifiers();
    this.presenter.getAddressTypes();
    this.presenter.getSuggestedDates();
    this.presenter.getPaymentTypes();
    this.presenter.getProviders();
    this.presenter.getTimeRangeInOut();
  }
}
