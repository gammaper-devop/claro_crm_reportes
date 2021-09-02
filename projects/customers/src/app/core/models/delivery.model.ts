import { Generics } from '@claro/crm/commons';
import { IParameter } from './';
import { AddressIdentifier } from './address.model';
import { PaymentType } from './payment-type.model';
import { Department, Province, District } from './ubigeo.model';

export class Delivery {
  contactParameters: ContactParameters;
  addressParameters: AddressParameters;
  district: District;
  province: Province;
  department: Department;
  datesParameters: DatesParameters;
  paymentParameters: PaymentParameters;
  placementParameters: PlacementParameters;
  deliveryDetails: string;

  constructor() {
    this.contactParameters = new ContactParameters();
    this.addressParameters = new AddressParameters();
    this.datesParameters = new DatesParameters();
    this.district = null;
    this.province = null;
    this.department = null;
    this.paymentParameters = new PaymentParameters();
    this.placementParameters = new PlacementParameters();
    this.deliveryDetails = '';
  }
}


export class ContactParameters {
  name: string;
  contactNumber: string;
  email: string;

  constructor(){
    this.name = '';
    this.contactNumber = '';
    this.email = '';
  }
}

export class AddressParameters {
  addressIdentifier: AddressIdentifier;
  addressName: string;
  addressNumber: string;
  addressWithoutNumberCheck: boolean;
  addressType: IParameter;
  addressTypeName: string;
  addressLt: string;
  addressFull: string;
  addressReference: string;

  constructor(){
    this.addressIdentifier = null;
    this.addressName = '';
    this.addressNumber = '';
    this.addressWithoutNumberCheck = false;
    this.addressType = null;
    this.addressTypeName = '';
    this.addressLt = '';
    this.addressFull = '';
    this.addressReference = '';
  }
}

export class DatesParameters {
  deliveryTimeRange: Generics;
  selectedDate: Date;

  constructor(){
    this.deliveryTimeRange = null;
    this.selectedDate = null;
  }
}

export class PaymentParameters {
  paymentType: PaymentType;
  paymentMode: PaymentType;
  paymentId: string;

  constructor(){
    this.paymentType = null;
    this.paymentMode = null;
    this.paymentId = '';
  }
}

export class PlacementParameters {
  placementCall: IParameter;
  placementInOut: Generics;

  constructor(){
    this.placementCall = null;
    this.placementInOut = null;
  }
}

