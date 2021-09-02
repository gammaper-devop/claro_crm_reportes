export interface OfficeResponse {
  channel: string;
  officeSalecode: string;
  officeDescription: string;
  productCodeType: string;
  officeType: string;
  deparmentCode: string;
  region: string;
  orgSale: string;
  warehouseCode: string;
  centerCode: string;
  interlocutorCode: string;
  interlocutorCodeFather: string;
  chainName: string;
  virtualOfficeType: string;
}

export class Office {
  channel: string;
  officeCode: string;
  officeDescription: string;
  productCodeType: string;
  officeType: string;
  departmentCode: string;
  region: string;
  orgSale: string;
  warehouseCode: string;
  centerCode: string;
  interlocutorCode: string;
  interlocutorCodeFather: string;
  chainName: string;
  virtualOfficeType: string;

  constructor(office: OfficeResponse) {
    this.channel = office.channel || '';
    this.officeCode = office.officeSalecode || '';
    this.officeDescription = office.officeDescription || '';
    this.productCodeType = office.productCodeType || '';
    this.officeType = office.officeType || '';
    this.departmentCode = office.deparmentCode || '';
    this.region = office.region || '';
    this.orgSale = office.orgSale || '';
    this.warehouseCode = office.warehouseCode || '';
    this.centerCode = office.centerCode || '';
    this.interlocutorCode = office.interlocutorCode || '';
    this.interlocutorCodeFather = office.interlocutorCodeFather || '';
    this.chainName = office.chainName || '';
    this.virtualOfficeType = office.virtualOfficeType || '';
  }
}
