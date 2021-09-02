export interface PersonResponse {
  customerCode: string;
  documentTypeCode: string;
  documentTypeDescription: string;
  documentNumber: string;
  nationalityCode: string;
  nationalityDescription: string;
  civilStatusCode: string;
  civilStatusDescription: string;
  email: string;
  phoneNumber: string;
  legalDirection: string;
  sex: string;
  fullName: string;
  name: string;
  firstName: string;
  secondName: string;
  departmentCode: string;
  provinceCode: string;
  districtCode: string;
  departmentDesc: string;
  provinceDesc: string;
  districtDesc: string;
  birthDate: string;
  expiryDate: string;
  uniqueCustomerCode: string;
  participantId: string;
  customerCodePublic: string;
}

export class Person {
  customerCode: string;
  documentTypeCode: string;
  documentTypeDescription: string;
  documentNumber: string;
  nationalityCode: string;
  nationalityDescription: string;
  civilStatusCode: string;
  civilStatusDescription: string;
  email: string;
  phoneNumber: string;
  legalDirection: string;
  sex: string;
  fullName: string;
  name: string;
  firstName: string;
  secondName: string;
  departmentCode: string;
  provinceCode: string;
  districtCode: string;
  departmentDescription: string;
  provinceDescription: string;
  districtDescription: string;
  birthDate: string;
  expiryDate: string;
  uniqueCustomerCode: string;
  participantId: string;
  customerCodePublic: string;
  constructor(customer: PersonResponse) {
    this.customerCode = customer.customerCode ? customer.customerCode : '';
    this.documentTypeCode = customer.documentTypeCode
      ? customer.documentTypeCode
      : '';
    this.documentTypeDescription = customer.documentTypeDescription
      ? customer.documentTypeDescription
      : '';
    this.documentNumber = customer.documentNumber
      ? customer.documentNumber
      : '';
    this.nationalityCode = customer.nationalityCode
      ? customer.nationalityCode
      : '';
    this.nationalityDescription = customer.nationalityDescription
      ? customer.nationalityDescription
      : '';
    this.civilStatusCode = customer.civilStatusCode
      ? customer.civilStatusCode
      : '';
    this.civilStatusDescription = customer.civilStatusDescription
      ? customer.civilStatusDescription
      : '';
    this.email = customer.email ? customer.email : '';
    this.phoneNumber = customer.phoneNumber ? customer.phoneNumber : '';
    this.legalDirection = customer.legalDirection
      ? customer.legalDirection
      : '';
    this.sex = customer.sex ? customer.sex : '';
    this.fullName = customer.fullName ? customer.fullName : '';
    this.name = customer.name ? customer.name : '';
    this.firstName = customer.firstName ? customer.firstName : '';
    this.secondName = customer.secondName ? customer.secondName : '';
    this.departmentCode = customer.departmentCode || '';
    this.provinceCode = customer.provinceCode || '';
    this.districtCode = customer.districtCode || '';
    this.departmentDescription = customer.departmentDesc || '';
    this.provinceDescription = customer.provinceDesc || '';
    this.districtDescription = customer.districtDesc || '';
    this.birthDate = customer.birthDate ? customer.birthDate : '';
    this.expiryDate = customer.expiryDate ? customer.expiryDate : '';
    this.uniqueCustomerCode = customer.uniqueCustomerCode
      ? customer.uniqueCustomerCode
      : '';
    this.participantId = customer.participantId ? customer.participantId : '';
    this.customerCodePublic = customer.customerCodePublic
      ? customer.customerCodePublic
      : '';
  }
}
