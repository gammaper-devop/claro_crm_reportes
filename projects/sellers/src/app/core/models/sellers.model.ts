export interface SellerResponse {
  id: string;
  documentType: string;
  documentTypeDescription: string;
  documentNumber: string;
  pointSale: string;
  pointSaleCode: string;
  names: string;
  motherLastName: string;
  lastName: string;
  phone: string;
  email: string;
  status: string;
  statusDescription: string;
  registerDate: string;
  unregisterDate: string;
  authentication: string;
  userRegistration: string;
  userModification: string;
  modificationDate: string;
  employeeId: string;
  records: SellerResponse[];
}

export class Seller {
  id: string;
  account: string;
  documentType: string;
  documentTypeDescription: string;
  documentNumber: string;
  pointSale: string;
  pointSaleCode: string;
  names: string;
  motherLastName: string;
  lastName: string;
  phone: string;
  email: string;
  status: string;
  statusDescription: string;
  registerDate: string;
  unregisterDate: string;
  authentication: string;
  userRegistration: string;
  userModification: string;
  modificationDate: string;
  records: Seller[];

  constructor(sellers: SellerResponse) {
    this.id = sellers.id || '';
    this.account = sellers.employeeId || '';
    this.documentType = sellers.documentType || '';
    this.documentTypeDescription = sellers.documentTypeDescription || '';
    this.documentNumber = sellers.documentNumber || '';
    this.pointSale = sellers.pointSale || '';
    this.pointSaleCode = sellers.pointSaleCode || '';
    this.names = sellers.names || '';
    this.motherLastName = sellers.motherLastName || '';
    this.lastName = sellers.lastName || '';
    this.phone = sellers.phone || '';
    this.email = sellers.email || '';
    this.status = sellers.status || '';
    this.statusDescription = sellers.statusDescription || '';
    this.registerDate = sellers.registerDate || '';
    this.unregisterDate = sellers.unregisterDate || '';
    this.authentication = sellers.authentication || '';
    this.userRegistration = sellers.userRegistration || '';
    this.userModification = sellers.userModification || '';
    this.modificationDate = sellers.modificationDate || '';
    if (sellers.records) {
      this.records = sellers.records.map(
        (resp: SellerResponse) => new Seller(resp),
      );
    }
  }
}
