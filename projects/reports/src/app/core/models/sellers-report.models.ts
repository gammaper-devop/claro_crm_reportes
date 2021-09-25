export interface ListSellersReport{
    employeeId: string,
    documentType: string,
    documentNumber: string,
    employeeUser: string,
    pointSaleCode: string,
    names: string,
    lastname: string,
    firstname: string,
    employeePhone: string,
    employeeEmail: string,
    employeeStatus: string,
    registerDate: string,
    registerUser: string,
    authentication: string,
    lowDateSeller: string,
    modifyDate: string,
    modifyUser: string,
    inability: string,
    lockDate: string
}

export class ListSellersReportsToExcel {
    documentType: string;
    documentNumber: string;
    fullNames: string;
    employeeId: string;
    employeePhone: string;
    employeeUser: string;
    pointSaleCode: string;   
    employeeStatus: string;
    authentication: string;
    

    constructor(listSellersReports: ListSellersReport) {
        this.employeeId = listSellersReports.employeeId ? listSellersReports.employeeId.toLocaleUpperCase() : '';
        this.documentType = listSellersReports.documentType ? listSellersReports.documentType.toLocaleUpperCase() : '';
        this.documentNumber = listSellersReports.documentNumber ? listSellersReports.documentNumber : '';
        this.employeeUser = listSellersReports.employeeUser ? listSellersReports.employeeUser.toLocaleUpperCase()  : '';
        this.pointSaleCode = listSellersReports.pointSaleCode ? listSellersReports.pointSaleCode : '';
        this.fullNames = listSellersReports.names.toLocaleUpperCase() +" " +listSellersReports.lastname.toLocaleUpperCase() + " " +listSellersReports.firstname.toLocaleUpperCase();
        this.employeePhone = listSellersReports.employeePhone ? listSellersReports.employeePhone : '';
        this.employeeStatus = listSellersReports.employeeStatus ? listSellersReports.employeeStatus : '';
        this.authentication = listSellersReports.authentication ? listSellersReports.authentication.toLocaleUpperCase() : '';
    }
}