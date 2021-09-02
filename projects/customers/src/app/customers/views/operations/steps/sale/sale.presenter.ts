import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  EErrorTitle,
  EErrorType,
  ErrorCodes,
  ErrorResponse,
  SnackbarService,
  CRMGenericsService,
  Office,
  CRMErrorService,
} from '@claro/crm/commons';
import { User } from '@shell/app/core';
import {
  Campaign,
  Customer,
  CustomerService,
  Department,
  ESaleOption,
  IParameter,
  Line,
  PopulatedCenter,
  Price,
  SaleService,
  Ubigeo,
  Maxlines,
  Plan,
} from '@customers/app/core';
import { Material } from '@customers/app/core/models/materials.model';

@Injectable()
export class SalePresenter {
  office: Office;
  modalities: IParameter[] = [];
  productsTypes: IParameter[] = [];
  saleOptions: { [phone: string]: IParameter[] } = {};
  campaigns: Campaign[][] = [];
  prices: Price[][] = [];
  plans: Plan[][] = [];
  plan: Plan;
  responseMessage: any;
  error: ErrorResponse;
  customer: Customer;
  departments: Department[] = [];
  ubigeos: Ubigeo[][] = [];
  populatedCenters: PopulatedCenter[][] = [];
  simData$: any;
  equipoData$: any;
  showPageError = false;
  showSerieInfo: string[] = [];
  errorSerie: {
    iccid: '';
    imei: '';
  }[] = [];
  isFunctionalError = EErrorType.Functional;
  materialICCID: Material[] = [];
  materialSelectICCID: IParameter[] = [];
  materialIMEI: Material[] = [];
  materialSelectIMEI: IParameter[];
  serieICCID: Material[] = [];
  serieIMEI: Material[] = [];
  selectSerieICCID: IParameter[] = [];
  selectSerieIMEI: IParameter[] = [];
  newLineOptions: IParameter[][] = [];

  constructor(
    public genericsService: CRMGenericsService,
    public snackbarService: SnackbarService,
    private customerService: CustomerService,
    private saleService: SaleService,
    private errorService: CRMErrorService,
  ) {
    this.saleService.init();
    this.office = this.genericsService.getOfficeDetail();
  }

  async getMaxlines(
    user: User,
    customer: Customer,
    saleOperationType: string,
  ): Promise<Maxlines> {
    const body = {
      typeSale: '02',
      operationType: saleOperationType,
      documentType: customer.documentTypeCode,
      documentNumber: customer.documentNumber,
      channelCode: user.channel,
      userAccount: user.account,
    };
    try {
      return await this.saleService.getMaxlines(body);
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-942');
      return null;
    }
  }

  async getDepartments() {
    if (this.departments.length) {
      return;
    }
    this.departments = await this.customerService
      .getDepartments()
      .pipe(
        catchError(error => {
          this.error = this.errorService.showError(error, 'CRM-933');
          return throwError(error);
        }),
      )
      .toPromise();
  }

  async getModalities() {
    if (this.modalities.length) {
      return;
    }
    try {
      this.modalities = await this.saleService.getModalities();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-961');
    }
  }

  async getProductsTypes(channel: any) {
    if (this.productsTypes.length) {
      return;
    }
    try {
      const body = {
        channelCode: channel,
        departament: this.office.departmentCode,
      };
      this.productsTypes = await this.saleService.getProductsTypes(body);
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-969');
    }
  }

  async getOptions(lines: Line[], secNumber: string) {
    if (Object.keys(this.saleOptions).length) {
      return;
    }
    try {
      const saleOptions = {};
      let saleOptionsExists = false;
      lines.forEach(line => {
        saleOptions[line.phone] = line.saleOptions;
        saleOptionsExists = line.saleOptions && line.saleOptions.length > 0;
      });
      if (saleOptionsExists) {
        this.saleOptions = saleOptions;
      } else {
        this.saleOptions = await this.saleService.getOptions(
          secNumber,
          lines.map(line => line.phone),
        );
      }
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-962');
    }
  }

  async getNewLineOptions(i: number, productType: IParameter, user: User) {
    try {
      const body = {
        channel: user.channel,
        product: productType.value,
        state: '1',
      };
      this.newLineOptions[i] = await this.saleService.getNewLineOptions(body);
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-962');
    }
  }

  async getMaterials(
    saleOption: string,
    operationType: string,
    line: Line,
    isReno: boolean,
  ) {
    try {
      const body = {
        officeSalecode: this.office.interlocutorCode,               // interlocutorCode
        officeDescription: this.office.officeDescription,
        officeType: this.office.officeType,
        flagBam: '',
        saleOption,
        product: line.service?.value || line.productType?.value,
        operationType,
      };
      if (
        isReno &&
        !this.materialICCID.length &&
        (saleOption === ESaleOption.Pack || saleOption === ESaleOption.Chip)
      ) {
        body.saleOption = ESaleOption.Chip;
        this.materialICCID = await this.saleService.getMaterials(body);
        this.materialSelectICCID = this.materialICCID.map(
          material =>
            ({
              value: material.code,
              label: material.description,
            } as IParameter),
        );
      }
      if (saleOption === ESaleOption.Pack || saleOption === ESaleOption.Phone) {
        body.saleOption = isReno ? ESaleOption.Phone : ESaleOption.Pack;
        this.materialIMEI = await this.saleService.getMaterials(body);
        this.materialSelectIMEI = this.materialIMEI.map(
          material =>
            ({
              value: material.code,
              label: material.description,
            } as IParameter),
        );
      }
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-000');
    }
  }

  async getSeries(type: 'iccid' | 'imei', user: User, line?: Line, material?: Material,isPorta?:boolean) {
    try { //mg13
      
      isPorta= (typeof isPorta === 'undefined') || isPorta==null ? false: isPorta;
     
      const body = {
        officeSalecode: this.office.interlocutorCode,
        officeDescription: "",
        officeType: this.office.officeType,
        centerCode: this.office.centerCode,
        warehouseCode: this.office.warehouseCode,
        materialCode: material?.code || '',
        materialDescription: material?.description || '',
        flagPicking: user.picking.flagPicking,
        productType:isPorta ? "01" :  typeof line !== 'undefined' ? line.productType.value : '',
      };
     
      if (type === 'iccid') {
     
        this.serieICCID = [];
        this.selectSerieICCID = [];
        this.serieICCID = await this.saleService.getSeries(body, !!material);
        this.selectSerieICCID = this.serieICCID.map(
          serieICCID =>
            ({
              value: serieICCID.serie,
              label: serieICCID.serie,
            } as IParameter),
        );
      } else {
     
        this.serieIMEI = [];
        this.selectSerieIMEI = [];
        this.serieIMEI = await this.saleService.getSeries(body);
        this.selectSerieIMEI = this.serieIMEI.map(
          serieIMEI =>
            ({ value: serieIMEI.serie, label: serieIMEI.serie } as IParameter),
        );
      }
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-001');
    }
  }

  async validateDisponibility(
    type: 'iccid' | 'imei',
    serie: string,
    phone: string,
    line: Line,
    i: number,
  ) {
    try {
      this.showSerieInfo[i] = type;
      this.errorSerie[i][type] = null;
      return await this.saleService.validateDisponibility({
        phoneNumber: phone && type === 'iccid' ? phone : '',
        serieNumber: serie,
        officeType: this.office.officeType,
        fatherInterlocutorCode: this.office.interlocutorCodeFather,
        materialType: type === 'iccid' ? 'PS' : 'PB',
        interlocutorCode: this.office.interlocutorCode,
        productType: line.service?.value || line.productType?.value,
      });
    } catch (error) {
      if (error.errorType === EErrorType.Functional) {
        this.errorSerie[i][type] = error.description;
      } else {
        this.error = this.errorService.showError(error, 'CRM-963');
      }
      return false;
    }
  }

  async validateDisponibilityRepo(
    type: 'iccid' | 'imei',
    serie: string,
    phone: string,
    i: number,
    user: User,
    line: Line,
  ) {
    try {
      this.showSerieInfo[i] = type;
      this.errorSerie[i][type] = null;
      return await this.saleService.validateDisponibilityRepo({
        phoneNumber: phone && type === 'iccid' ? phone : '',
        serieNumber: serie,
        channel: user.channel,
        officeType: this.office.officeCode,
        codtypeOperation: line.option.value,
        familyProduct: type === 'iccid' ? 'PS' : 'PB',
        flagConsult: type === 'iccid' ? '01' : '02',
        typeHlr: line.typeHlr,
        flagTechnology: line.flagTechnology,
      });
    } catch (error) {
      if (error.errorType === EErrorType.Functional) {
        this.errorSerie[i][type] = error.description;
      } else {
        this.error = this.errorService.showError(error, 'CRM-963');
      }
      return false;
    }
  }

  async getCampaigns(
    user: User,
    customer: Customer,
    line: Line,
    saleOperationType: string,
    secNumber: string,
    i: number,
  ) {
       try {
      this.campaigns[i] = await this.saleService.getCampaigns({
        sequentialNumber: secNumber || '',
        phoneNumber: line.phone || '',
        documentNumber: customer.documentNumber,
        officeSale: this.office.officeCode,
        operationType: line.option.value,
        interlocutorCode: this.office.interlocutorCode,
        channel: user.channel,
        departmentCode: this.office.departmentCode,
        productoType:
          (line.service && line.service.value) ||
          (line.productType && line.productType.value),
        salesType: saleOperationType,
        ICCIDCode: (line.iccid && line.iccid.code) || '',
        IMEICode: (line.imei && line.imei.code) || '',
        ageLine:  saleOperationType=="03"? localStorage.getItem('ageLineRenewal'):saleOperationType=="04"?localStorage.getItem('ageLineReplacement'): "0"
      });
    } catch (error) {
       error = {
          code: error.code,
          title: '',
          description: error.description,
          errorType: EErrorType.Functional,
      } as ErrorResponse;
      this.error = this.errorService.showError(error);
    }
  }

  async getPrices(saleOperationType: string, line: Line, i: number) {
    try {
      if (
        !line.iccid ||
        (line.option && line.option.value === ESaleOption.Pack && !line.imei) ||
        !line.campaign
      ) {
        return false;
      }
      this.prices[i] = await this.saleService.getPrices({
        chipSeries: line.iccid ? line.iccid.serie : '',
        chipMaterialCode: line.iccid.code,
        descriptionMaterialChip: line.iccid.description,
        equipmentSeries: line.imei ? line.imei.serie : '',
        equipmentMaterialCode: line.imei ? line.imei.code : '',
        equipmentMaterialDescription: line.imei ? line.imei.description : '',
        officeType: this.office.officeType,
        campaingCode: line.campaign.value,
        interlocutorCode: this.office.interlocutorCode,
        deparmnetCode: this.office.departmentCode,
        salesType: saleOperationType,
        productType:
          (line.service && line.service.value) ||
          (line.productType && line.productType.value),
        operationType: line.option.value,
      });

      if(this.prices[i].length === 0) {
        return false;
      }
      
      if (line.tgfiReason && line.tgfiReason.value) {
        this.prices[i][0].chipTotalPrice = '0';
      }
      return true;
    } catch (error) {
      error = {
        code: error.code,
        title: '',
        description: error.description,
        errorType: EErrorType.Functional,
      } as ErrorResponse;
      this.error = this.errorService.showError(error);
    }
  }
  async getRefreshPrices(
    saleOperationType: string,
    line: Line,
    i: number,
  ): Promise<Price[]> {
    try {
      if (
        !line.iccid ||
        (line.option && line.option.value === ESaleOption.Pack && !line.imei) ||
        !line.campaign
      ) {
        return [];
      }
      return await this.saleService.getPrices({
        chipSeries: line.iccid.serie,
        chipMaterialCode: line.iccid.code,
        descriptionMaterialChip: line.iccid.description,
        equipmentSeries: line.imei ? line.imei.serie : '',
        equipmentMaterialCode: line.imei ? line.imei.code : '',
        equipmentMaterialDescription: line.imei ? line.imei.description : '',
        officeType: this.office.officeType,
        campaingCode: line.campaign.value,
        interlocutorCode: this.office.interlocutorCode,
        deparmnetCode: this.office.departmentCode,
        salesType: saleOperationType,
        productType:
          (line.service && line.service.value) ||
          (line.productType && line.productType.value),
        operationType: line.option.value,
      });
    } catch (error) {
      error = {
        code: error.code,
        title: '',
        description: error.description,
        errorType: EErrorType.Functional,
      } as ErrorResponse;
      this.error = this.errorService.showError(error);
    }
  }

  async getPlans(user: User, saleOperationType: string, line: Line, i: number) {
    try {
     
      console.log("Iniciando........");
       await this.saleService.getPlans({
        officeSale: this.office.officeCode,
        productType:
          (line.service && line.service.value) ||
          (line.productType && line.productType.value),
        operationType: saleOperationType,
      }).then((pla) => {
        console.log("thennn........");
        this.plans[i] =pla;
       
       
        let response : any;
        let flag=false;
        console.log(saleOperationType);
        switch (saleOperationType) {
          
          case '33':
          case '03':
            console.log('saleOperationType es 03,33 o Reno');
          response  =JSON.parse(localStorage.getItem('ResponseLineRenewal')); 
          if( pla.filter(plan => plan.value == response.codeOffer ).length==0){
            this.plans[i].unshift( new Plan({code:response.codeOffer,description:response.idOfferDescription,productOfferId:response.idOfferPlan} ));
            this.plan=this.plans[i][0];
          }else{
            this.plan=pla.filter(plan => plan.value == response.codeOffer )[0];
          }
             break;
          case '11':
          case '04':
            console.log('saleOperationType es 04,11 o Repo');
            response  =JSON.parse(localStorage.getItem('ResponseLineReplacement'));  
            console.log(response.codeOffer);    
       
            if( pla.filter(plan => plan.value == response.codeOffer ).length==0)  {
            
              this.plans[i].unshift( new Plan({code:response.codeOffer,description:response.idOfferDescription,productOfferId:response.idOfferPlan} ));
              this.plan=this.plans[i][0];
             
            
            }
            else {

              this.plan=pla.filter(plan => plan.value == response.codeOffer )[0];
             
              
            }
  
            break;         
        }
        
      
        console.log(pla);
        console.log(this.plans[i]);
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        console.log("termino........");
        console.log(this.plans[i]);
    
    });
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-966');
    }
  }

  async getUbigeos(departmentCode: string, i: number) {
    try {
      this.ubigeos[i] = await this.customerService.getUbigeos(departmentCode);
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-967');
    }
  }

  async getPopulatedCenters(ubigeoCode: string, i: number) {
    try {
      this.populatedCenters[i] = await this.customerService.getPopulatedCenters(
        ubigeoCode,
      );
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-968');
    }
  }

  async addItem(user: User, customer: Customer, line: Line) {
    try {
      return await this.saleService.addItem({
        documentNumber: customer.documentNumber,
        phoneNumber: line.phone || '',
        departmentCode: this.office.departmentCode,
        provinceCode: line.ubigeo.provinceCode,
        districtCode: line.ubigeo.districtCode,
        populatedCenter: line.populatedCenter.label,
        coverageIndicator: line.populatedCenter.value,
        imeiSeries:
          (!user.picking.flagPicking && line.imei && line.imei.serie) || '',
        imeiCode: (line.imei && line.imei.code) || '',
      });
    } catch (error) {
      if (error.errorType === EErrorType.Technical) {
        error.description = ErrorCodes['CRM-971'];
      }
      this.snackbarService.show(error.description, 'error');
      return false;
    }
  }

  async getStockAvailability(material: string): Promise<boolean> {
    this.error = null;
    const body = {
      officeType: this.office.officeType,
      centerCode: this.office.centerCode,
      warehouseCode: this.office.warehouseCode,
      interlocutorCode: this.office.interlocutorCode,
      materialCode: material || '',
    };
    try {
      await this.saleService.stockValidation(body);
      return true;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-1010');
      return false;
    }
  }
}
