import { OfficeResponse, Office } from '@claro/crm/commons';
import { EChannel } from '../enums';

export interface UserResponse {
  redUserCode: string;
  password: string;
  areaId: string;
  profileCode: string;
  chainProfile: string;
  userCode: string;
  sisactUserCode: string;
  sapSellerCode: string;
  channelCode: string;
  channelDescription: string;
  tgChip: string;
  flagTgChipActive:string;
  officeData: OfficeResponse;
  officeSale: string;
  officeSaleDescription: string;
  documentType: string;
  documentNumber: string;
  pin: string;
  fullName: string;
  vendorCode: string;
  phoneNumber: string;
  flagBiometric: boolean;
  flagPin: boolean;
  paymentNumber: {
    position: string;
    prefix: string;
    character: string;
    minimumSize: string;
    maximumSize: string;
  };
  seller: {
    profileCode: string;
    profilesAllowed: string;
    configurations: {
      biometricAttemptsNumber: number;
      documentTypeValidations: {
        documentType: string;
        phoneNumber: boolean;
        biometric: boolean;
        pin: boolean;
        account: boolean;
      }[];
    };
  };
  biometricAttemptsNumber: number;
  pinAttemptsNumber: number;
  timerPinValidate: number;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  configurations: {
    key: string;
    value: string;
  }[];
  controls: {
    value: string;
    flagSystem: string;
  }[];
  documentVendor: string;
  nameVendor: string;
  picking: {
    flagPicking: string;
    flagDelivery: string;
    flagPayOnline: string;
    iccid: string;
    imei: string;
  };
  finalMessages: {
    msgRenoEquipo: string;
    msgRenoPack: string;
    msgRepo: string;
    msgAlta: string;
    msgAltaM1: string;
    msgPorta: string;
    msgPortaM1: string;
  };
}

export class User {
  account: string;
  areaId: string;
  profileCode: string;
  chainProfile: string;
  userCode: string;
  sisactUserCode: string;
  sapSellerCode: string;
  channel: string;
  channelDescription: string;
  tgChip: string;
  flagTgChipActive:string;
  officeData: Office;
  office: string;
  officeDescription: string;
  documentType: string;
  documentNumber: string;
  name: string;
  vendorCode: string;
  phone: string;
  flagBiometric: boolean;
  flagPin: boolean;
  paymentNumber: {
    position: string;
    prefix: string;
    character: string;
    minimumSize: string;
    maximumSize: string;
  };
  seller: {
    profileCode: string;
    profilesAllowed: string;
    configurations: {
      biometricAttemptsNumber: number;
      documentTypeValidations: {
        documentType: string;
        phoneNumber: boolean;
        biometric: boolean;
        pin: boolean;
        account: boolean;
      }[];
    };
  };
  biometricAttemptsNumber: number;
  pinAttemptsNumber: number;
  pinTimer: number;
  configurations: {
    key: string;
    value: string;
  }[];
  controls: {
    value: string;
    flagSystem: string;
  }[];
  documentVendor: string;
  nameVendor: string;
  isAdmin: boolean;
  allowedModules: string[];
  picking: {
    flagPicking: string;
    flagDelivery: string;
    flagPayOnline: string;
    iccid: string;
    imei: string;
  };
  finalMessages: {
    msgRenoEquipo: string;
    msgRenoPack: string;
    msgRepo: string;
    msgAlta: string;
    msgAltaM1: string;
    msgPorta: string;
    msgPortaM1: string;
  };

  constructor(user: UserResponse) {
    this.account = user.redUserCode || '';
    this.areaId = user.areaId || '';
    this.profileCode = user.profileCode || '';
    this.chainProfile = user.chainProfile || '';
    this.userCode = user.userCode || '';
    this.sisactUserCode = user.sisactUserCode || '';
    this.sapSellerCode = user.sapSellerCode || '';
    this.channel = user.channelCode || '';
    this.channelDescription = user.channelDescription || '';
    this.tgChip = user.tgChip || '';
    this.flagTgChipActive = user.flagTgChipActive || '';
    this.officeData = new Office(user.officeData || ({} as OfficeResponse));
    this.office = user.officeSale || '';
    this.officeDescription = user.officeSaleDescription || '';
    this.documentType = user.documentType || '';
    this.documentNumber = user.documentNumber || '';
    this.name = user.fullName || '';
    this.vendorCode = user.vendorCode || '';
    this.phone = user.phoneNumber || '';
    this.flagBiometric = user.flagBiometric || false;
    this.flagPin = user.flagPin || false;
    this.paymentNumber = user.paymentNumber || {
      position: '',
      prefix: '',
      character: '',
      minimumSize: '1',
      maximumSize: '99',
    };
    this.seller = user.seller || {
      profileCode: '',
      profilesAllowed: '',
      configurations: {
        biometricAttemptsNumber: 3,
        documentTypeValidations: [
          {
            documentType: '01',
            phoneNumber: true,
            biometric: true,
            pin: true,
            account: true,
          },
          {
            documentType: '04',
            phoneNumber: false,
            biometric: false,
            pin: false,
            account: true,
          },
        ],
      },
    };
    this.biometricAttemptsNumber = user.biometricAttemptsNumber || 3;
    this.pinAttemptsNumber = user.pinAttemptsNumber || 2;
    this.pinTimer = user.timerPinValidate || 60;
    this.configurations = user.configurations || [];
    this.controls = user.controls || [];
    this.documentVendor = user.documentVendor || '';
    this.nameVendor = user.nameVendor || '';
    // this.seller.profileCode = 'mockAdmin';
    this.isAdmin =
      this.seller.profileCode && this.seller.profileCode === this.profileCode;
    this.allowedModules = ['dashboard', 'customers', 'contracts', 'reports', 'biometric'];
    if (this.channel === EChannel.CAC) {
     // this.allowedModules.pop();
    }
    if ((user.configurations.filter(conf => conf.key == 'biometricMenu')[0].value) === '0') {
      this.allowedModules.pop();
    }



    if (this.isAdmin) {
      this.allowedModules = ['sellers'];
    }
    this.picking = user.picking || {
      flagPicking: '',
      flagDelivery: '',
      flagPayOnline: '',
      iccid: '',
      imei: '',
    };
    this.finalMessages = user.finalMessages || {
      msgRenoEquipo: '',
      msgRenoPack: '',
      msgRepo: '',
      msgAlta: '',
      msgAltaM1: '',
      msgPorta: '',
      msgPortaM1: '',
    };
  }

  update(currentUser: User, newUser: UserResponse): User {
    currentUser.account = newUser.redUserCode ?? currentUser.account;
    currentUser.areaId = newUser.areaId ?? currentUser.areaId;
    currentUser.profileCode = newUser.profileCode ?? currentUser.profileCode;
    currentUser.chainProfile = newUser.chainProfile ?? currentUser.chainProfile;
    currentUser.userCode = newUser.userCode ?? currentUser.userCode;
    currentUser.sisactUserCode =
      newUser.sisactUserCode ?? currentUser.sisactUserCode;
    currentUser.sapSellerCode =
      newUser.sapSellerCode ?? currentUser.sapSellerCode;
    currentUser.channel = newUser.channelCode ?? currentUser.channel;
    currentUser.channelDescription =
      newUser.channelDescription ?? currentUser.channelDescription;
    currentUser.tgChip = newUser.tgChip ?? currentUser.tgChip;
    currentUser.flagTgChipActive = newUser.flagTgChipActive ?? currentUser.flagTgChipActive;
    currentUser.officeData =
      (newUser.officeData && new Office(newUser.officeData)) ??
      currentUser.officeData;
    currentUser.office = newUser.officeSale ?? currentUser.office;
    currentUser.officeDescription =
      newUser.officeSaleDescription ?? currentUser.officeDescription;
    currentUser.documentType = newUser.documentType ?? currentUser.documentType;
    currentUser.documentNumber =
      newUser.documentNumber ?? currentUser.documentNumber;
    currentUser.name = newUser.fullName ?? currentUser.name;
    currentUser.vendorCode = newUser.vendorCode ?? currentUser.vendorCode;
    currentUser.phone = newUser.phoneNumber ?? currentUser.phone;
    currentUser.flagBiometric =
      newUser.flagBiometric ?? currentUser.flagBiometric;
    currentUser.flagPin = newUser.flagPin ?? currentUser.flagPin;
    currentUser.paymentNumber =
      newUser.paymentNumber ?? currentUser.paymentNumber;
    currentUser.seller = newUser.seller ?? currentUser.seller;
    currentUser.pinTimer = newUser.timerPinValidate ?? currentUser.pinTimer;
    currentUser.biometricAttemptsNumber =
      newUser.biometricAttemptsNumber ?? currentUser.biometricAttemptsNumber;
    currentUser.pinAttemptsNumber =
      newUser.pinAttemptsNumber ?? currentUser.pinAttemptsNumber;
    currentUser.configurations =
      newUser.configurations ?? currentUser.configurations;
    currentUser.controls = newUser.controls ?? currentUser.controls;
    currentUser.documentVendor =
      newUser.documentVendor ?? currentUser.documentVendor;
    currentUser.nameVendor = newUser.nameVendor ?? currentUser.nameVendor;
    currentUser.picking = newUser.picking ?? currentUser.picking;
    currentUser.finalMessages =
      newUser.finalMessages ?? currentUser.finalMessages;
    return currentUser;
  }
}
