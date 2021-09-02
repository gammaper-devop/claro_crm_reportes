import { Injectable } from '@angular/core';
import { UTILS } from '@claro/commons';
import {
  Biometric,
  BiometricConfig,
  CRMBiometricService,
  CRMErrorService,
  ErrorResponse,
  CRMGenericsService,
  Office,
} from '@claro/crm/commons';
import { User, EChannel } from '@shell/app/core';
import {
  Customer,
  CustomerService,
  Line,
  PortabilityService,
  PaymentsService,
  EOperationType,
  EFlowType,
  LineAdditional,
  ReplacementService,
  ECustomerTypes,
  Delivery,
  ESaleOption,
} from '@customers/app/core';
import {
  CustomerParameters,
  DeliveryParameters,
  ListSerie,
  Sale,
} from '@customers/app/core/models/sale.model';
import { MultipointsService } from '@customers/app/core/services/multipoints.service';
import { IParameter } from '@contracts/app/core';
import { ECustomerDocument } from '@claro/crm/commons';

@Injectable()
export class StepsPresenter {
  email: string;
  tradeAgreement: any[];
  error: ErrorResponse;
  errorSale: ErrorResponse;
  biometric: Biometric;
  biometricConfig: BiometricConfig;
  isScanning: boolean;
  successfulBiometric: boolean;
  noMoreAttempts: boolean;
  saleOperationType: string;
  isNewLine: boolean;
  isRenoRepo: boolean;
  isShowClaroPoints: boolean;
  secNumber: string;
  orderNumber: string;
  sale: Sale;
  customerParameters: CustomerParameters;
  saleSuccess: boolean;
  signatureType: string;
  portabilityIsValid: boolean;
  biometricRevalidate: boolean;
  orderNumberSynergi: string;
  productType: string;
  summaryPaymentPending: any;
  office: Office;
  customer: Customer;
  totalPrice: string;
  flowType: string;
  isReno: boolean;
  flagMultipoint: string;
  deliveryParameters: DeliveryParameters;
  channelsFromListMultipoints: IParameter[];
  isAlt: boolean;
  printPdfCAC: boolean;
  flagDisplayLoyaltyDisccount:boolean;
  constructor(
    private biometricService: CRMBiometricService,
    private genericsService: CRMGenericsService,
    private paymentService: PaymentsService,
    private portabilityService: PortabilityService,
    private customerService: CustomerService,
    private multipointService: MultipointsService,
    private replacementService: ReplacementService,
    private errorService: CRMErrorService,
  ) {
    this.init();
  }

  init() {
    this.secNumber = '';
    this.portabilityService.sendSectNumber('');
    this.orderNumber = '';
    this.successfulBiometric = false;
    this.noMoreAttempts = false;
    this.customer = this.customerService.getCustomer();
    this.sale = new Sale();
    this.customerParameters = new CustomerParameters();
    this.flowType = EFlowType.NEW_FLOW;
    this.office = this.genericsService.getOfficeDetail();
    this.deliveryParameters = new DeliveryParameters();
  }

  setOperationType(operationType: string) {
    this.init();
    this.saleOperationType = operationType;
    this.isNewLine = operationType === EOperationType.ALT;
    this.isRenoRepo =
      operationType === EOperationType.REP ||
      operationType === EOperationType.REN;
    this.isReno = operationType === EOperationType.REN;
    this.isAlt = operationType === EOperationType.ALT;
    this.isShowClaroPoints = operationType !== EOperationType.REP;
  }

  setSecNumber(secNumber: string) {
    this.secNumber = secNumber;
    this.portabilityService.sendSectNumber(secNumber);
  }

  setEmail(email: string) {
    if(email === null){
      this.email = '';
    }else{
      this.email = email;
    }
  }

  setSignatureType(signatureType: string) {
    this.signatureType = signatureType;
  }

  getListTradeAgreements(list) {
    this.tradeAgreement = list;
  }

  async getBiometricConfig(
    officeSaleCode: string,
    productType: string,
    processCode: string,
  ) {
    this.error = null;
    try {
      const response = await this.biometricService.getBestFingerprint({
        officeSaleCode,
        processCode,
        operationType: this.saleOperationType,
        productType,
        orderNumber: '',
      });
      this.biometricConfig = response.configuration;
      return !!this.biometricConfig.biometricFlag;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-943');
      return false;
    }
  }

  async passBiometric(
    orderNumber,
    secNumber,
    productType,
  ): Promise<{ value: string }> {
    this.error = null;
    try {
      return await this.biometricService.passBiometric({
        orderNumber: orderNumber,
        secNumber: secNumber,
        officeType: this.office.officeType,
        productType: productType,
        officeCode: this.office.officeCode,
        operationType: this.biometricConfig?.operationType || '',
      });
    } catch (error) {
      return { value: '0' };
    }
  }
  
  async getSummaryPaymentPending(body: any) {
    try {
      this.summaryPaymentPending = await this.paymentService.getPaymentsSummary(
        body,
      );
      this.productType = this.summaryPaymentPending.productType;
      return this.summaryPaymentPending;
    } catch (error) {
      return false;
    }
  }

  async saveSales(
    digitalFlag: boolean,
    customer: Customer,
    user: User,
    lines: Line[],
    withBiometric: boolean,
    multipointsSelects: any,
    deliveryRequest: Delivery,
    dispatchOption: IParameter,
    idBioParent: string,
    flagPicking: boolean,
  ) {
    console.log("entro saveSales");
    console.log("flagPicking",flagPicking);
    this.sale = new Sale();
    this.customerParameters = new CustomerParameters();
    this.deliveryParameters = new DeliveryParameters();
    this.sale.orgSale = this.office.orgSale;
    this.sale.officetype = this.office.officeType;
    this.sale.userAccount = user.account;
    this.sale.salesCodeSap = user.sapSellerCode;
    this.sale.codeOfficeSale =
      multipointsSelects?.selectPointSale.value || this.office.officeCode;
    this.sale.interlocutorCode = this.office.interlocutorCode;
    this.sale.sisActUserCode = user.sisactUserCode;
    this.sale.channel = user.channel;
    this.sale.channelDescription = user.channelDescription;
    this.sale.officeDescription = this.office.officeDescription;
    this.sale.idBioParent = idBioParent || '';
    this.sale.flagMultipoint = this.flagMultipoint || '0';
    this.sale.multipointSeller = multipointsSelects?.selectSellers.value || '';
    this.sale.loginOfficeCode = this.office.officeCode;
    this.sale.dispatchType = dispatchOption?.value || '';
    this.sale.flagPicking = flagPicking ? '1' : '0';
    console.log("this.sale.flagPicking",this.sale.flagPicking);
    this.sale.flagDelivery = user.picking.flagDelivery;
    if (EChannel.CAD === user.channel) {
      this.sale.documentVendor = user.documentVendor;
      this.sale.nameVendor = user.nameVendor;
    }
    if (this.isRenoRepo) {
      this.sale.saleType = lines[0].typeOperation.value;
      this.sale.typeOperation = lines[0].typeOperation.value;
      this.sale.descOperation = lines[0].typeOperation.label;
      this.sale.codeReplacement = '';
      this.sale.descReplacement = '';
      this.sale.customerCodePublic = customer.customerCodePublic || '0';
      this.sale.contractCodePublic = lines[0].contractCodePublic;
      this.sale.reasonRepoCode = lines[0].customerReason?.value || '';
      this.sale.reasonRepoDesc = lines[0].customerReason?.label || '';
      console.log("lines[0].tgfiReason");
      console.log(lines[0].tgfiReason);
      this.sale.tgfi = lines[0].tgfiReason ? true : false;
      console.log(this.sale.tgfi);
      this.sale.tgfiDescription = lines[0].tgfiReason?.label;
      this.sale.claroclubCampaignCode =
        lines[0].claroPoints?.campaignCode || '';
      this.sale.claroclubcampaignDescription =
        lines[0].claroPoints?.campaignDescription || '';
      this.customerParameters.codDepartment = customer.departmentCode || '';
      this.customerParameters.codProvince = customer.provinceCode || '';
      this.customerParameters.codDistrict = customer.districtCode || '';
      this.customerParameters.descDepartment =
        customer.departmentDescription || '';
      this.customerParameters.descProvince = customer.provinceDescription || '';
      this.customerParameters.descDistrict = customer.districtDescription || '';
      this.customerParameters.imei = '';
      this.customerParameters.phoneNumber = lines[0].phone;
      this.customerParameters.email = 
        this.email !== '' ? this.email : this.customer.email;
        //this.signatureType === 'digital-signature' ? this.customer.email : '';
    } else {
      this.sale.saleType = this.saleOperationType;
      this.sale.codDepartmentOffice = this.office.departmentCode;
      this.sale.nroSec = this.secNumber || '0';
      this.sale.customerCode = customer.customerCode;
      this.sale.productType =
        (lines[0].service && lines[0].service.value) ||
        (lines[0].productType && lines[0].productType.value);
      this.sale.discountLoyalty = String(lines[0].loyaltyDiscountAmount || '0');
      this.sale.factorConvert = String(
        lines[0].claroPoints?.factorClaroClub || '0',
      );
      this.sale.codeCampana = lines[0].claroPoints?.campaignCode || '';
      this.sale.descCampana = lines[0].claroPoints?.campaignDescription || '';
      this.sale.totalPoints = String(
        lines[0].claroPoints?.currentPoints || '0',
      );
      this.sale.discountAmount = String(
        lines[0].claroPoints?.moneyReceived || '0',
      );
      this.sale.usePoints = String(lines[0].claroPoints?.pointsChanged || '0');
      this.sale.imeiPicking = user.picking.imei;
      this.customerParameters.codDepartment =
        customer.departmentDescription || 'LIMA';
      this.customerParameters.codProvince =
        customer.provinceDescription || 'LIMA';
      this.customerParameters.codDistrict =
        customer.districtDescription || 'SAN ISIDRO';
      this.customerParameters.phoneNumber = customer.phoneNumber;
      this.customerParameters.email = 
        this.email !== '' ? this.email : this.customer.email;;
      this.customerParameters.billingEmail =
        this.signatureType === 'digital-signature' ? this.email : '';
    }

    if (deliveryRequest) {
      this.deliveryParameters.name = deliveryRequest?.contactParameters.name;
      this.deliveryParameters.phone =
        deliveryRequest?.contactParameters.contactNumber;
      this.deliveryParameters.email = deliveryRequest?.contactParameters.email;
      this.deliveryParameters.addressPrefixCode =
        deliveryRequest?.addressParameters.addressIdentifier?.abbreviation ||
        '';
      this.deliveryParameters.addressPrefixDescription =
        deliveryRequest?.addressParameters.addressIdentifier?.label || '';
      this.deliveryParameters.addressName =
        deliveryRequest?.addressParameters.addressName;
      this.deliveryParameters.addressNumber =
        deliveryRequest?.addressParameters.addressNumber;
      this.deliveryParameters.addressTypeCode =
        deliveryRequest?.addressParameters.addressType?.value || '';
      this.deliveryParameters.addressTypeDescription =
        deliveryRequest?.addressParameters.addressType?.label || '';
      this.deliveryParameters.blockNumber =
        deliveryRequest?.addressParameters.addressTypeName;
      this.deliveryParameters.lotNumber =
        deliveryRequest?.addressParameters.addressLt;
      this.deliveryParameters.department =
        deliveryRequest?.department?.value || '';
      this.deliveryParameters.province = deliveryRequest?.province?.value || '';
      this.deliveryParameters.district = deliveryRequest?.district?.value || '';
      this.deliveryParameters.address =
        deliveryRequest?.addressParameters.addressFull;
      this.deliveryParameters.reference =
        deliveryRequest?.addressParameters.addressReference;
      this.deliveryParameters.deliveryDate = UTILS.formatISODate(
        deliveryRequest?.datesParameters.selectedDate,
      );
      this.deliveryParameters.deliveryTimeRange =
        deliveryRequest?.datesParameters.deliveryTimeRange?.label || '';
      this.deliveryParameters.paymentTypeCode =
        deliveryRequest?.paymentParameters.paymentType?.value || '';
      this.deliveryParameters.paymentModeCode =
        deliveryRequest?.paymentParameters.paymentMode?.value || '';
      this.deliveryParameters.paymentModeDescription =
        deliveryRequest?.paymentParameters.paymentMode?.label || '';
      this.deliveryParameters.paymentId =
        deliveryRequest?.paymentParameters.paymentId || '';
      this.deliveryParameters.placementCall =
        deliveryRequest?.placementParameters.placementCall?.value || '';
      this.deliveryParameters.placementInOut =
        deliveryRequest?.placementParameters.placementInOut?.label || '';
      this.deliveryParameters.details = deliveryRequest?.deliveryDetails;
    }
//mg13
    this.sale.chainDeals =
      this.tradeAgreement?.map(agreement => {
        console.log(agreement.tradeAgreementValue==""?true:false);     
        return  agreement.tradeAgreementValue==""? true:false;
      }) || [];

    this.customerParameters.documentTypePVU = customer.documentTypeCode;
    this.customerParameters.documentNumber = customer.documentNumber;
    this.customerParameters.name = customer.name;
    this.customerParameters.firstName = customer.firstName;
    this.customerParameters.secondName = customer.secondName;
    this.customerParameters.birthDate = customer.birthDate;
    this.customerParameters.expirationDate = '';
    this.customerParameters.gender = customer.sex;
    this.customerParameters.businessName = customer.fullName;
    this.customerParameters.origin = withBiometric ? '2' : '3';
    this.customerParameters.direction = customer.legalDirection;
    this.customerParameters.phoneReference = customer.phoneNumber;
    this.customerParameters.ubigeo = lines[0].ubigeo?.value || '';
    this.customerParameters.civilState = customer.civilStatusDescription.charAt(
      0,
    );
    this.customerParameters.nationality = customer.nationalityCode;
    this.customerParameters.nationalityDescription =
      customer.nationalityDescription;
    this.sale.customerParameters = this.customerParameters;
    if (deliveryRequest) {
      this.sale.deliveryParameters = this.deliveryParameters;
    } else {
      delete this.sale.deliveryParameters;
    }

    lines.forEach((line, i) => {
      if (line.iccid?.serie) {
        this.sale.listSeries.push(this.addListSerie(line, 'iccid', i, user));
      }
      if (line.imei?.serie) {
        this.sale.listSeries.push(this.addListSerie(line, 'imei', i, user));
      }
    });

    try {
      this.error = null;
      let response: any;
      if (this.isRenoRepo) {
        console.log("entro reno");
        console.log(this.sale);
        response = await this.replacementService.saveSalesRenoRepo(this.sale);
      } else {
        console.log(this.sale);
        response = await this.portabilityService.saveSales(this.sale);
      }
      if (response) {
        this.orderNumber = response.orderNumber;
        this.orderNumberSynergi = response.orderNumberSynergi || '';
        this.totalPrice = Object.values(lines)
          .reduce((t, { totalPrice }) => t + Number(totalPrice), 0)
          .toFixed(2);

        const claropoints = lines[0].claroPoints?.moneyReceived || 0;
        const loyalty = lines[0].loyaltyDiscountAmount || 0;
        this.totalPrice = (
          Number(this.totalPrice) -
          claropoints -
          loyalty
        ).toFixed(2);

        this.saleSuccess = true;

        await this.getSummaryPaymentPending({
          orderNumber: this.orderNumber,
          orderType: this.saleOperationType,
        });
        lines.forEach((line, i) => {
          const lineAdditional = this.summaryPaymentPending.lines.find(
            l =>
              String(i + 1) === l.secuential &&
              (l.type === 'Equipo' || l.itemType === 'Chip'),
          );
          line.phone = lineAdditional?.line || '';
        });
        this.printPdfCAC =
          user.channel === EChannel.CAC && customer.documentTypeCode !== ECustomerDocument.DNI;
        
        if((user.configurations.filter(conf => conf.key == 'documentSalePrint')[0].value) === '1'){
            await this.postGenerateDocuments(digitalFlag, customer, user);
        }
        // if (!user.officeData.virtualOfficeType || this.printPdfCAC) {
        //   await this.postGenerateDocuments(digitalFlag, customer, user);
        // }
      }
      return this.saleSuccess;
    } catch (error) {
      this.saleSuccess = false;
      this.error = this.errorService.showError(error, 'CRM-972');
      return this.saleSuccess;
    }
  }

  addListSerie(line: Line, type: 'iccid' | 'imei', i: number, user: User) {
    const serie = line[type];
    const listSerie = new ListSerie();
    listSerie.serie = String(serie.serie) || '';
    listSerie.code = serie.code || '';
    listSerie.description = serie.description || '';
    listSerie.sequenceNumber = String(i + 1);
    listSerie.phoneNumber = line.phone || '0';
    listSerie.salePrice =
      type === 'iccid'
        ? line.price.chipPriceSales
        : line.price.equipmentPriceSales;
    listSerie.codListPrice = line.price.value;
    listSerie.descListPrice = line.price.label;
    listSerie.codCampana = line.campaign.value;
    listSerie.desCampana = line.campaign.label;
    listSerie.descCode = line.plan.value;
    listSerie.descPlan = line.plan.label;
    listSerie.basePrice =
      type === 'iccid'
        ? line.price.chipPriceBase
        : line.price.equipmentPriceBase;
    listSerie.totalPrice =
      type === 'iccid'
        ? line.price.chipTotalPrice
        : line.price.equipmentTotalPrice;
    listSerie.igvValue =
      type === 'iccid'
        ? line.price.chipAmountIgv
        : line.price.equipmentAmountIgv;
    listSerie.discount =
      type === 'iccid' ? line.price.chipDiscount : line.price.equipmentDiscount;
    listSerie.flagLP =
      type === 'iccid'
        ? line.price.chipSecureFlag
        : line.price.equipmentSecureFlag;
    listSerie.discountLoyalty = String(line.loyaltyDiscountAmount || '0');
    if (EChannel.CAD === user.channel) {
      listSerie.sku =
        type === 'iccid' ? line.price.chipSku : line.price.equipmentSku;
      listSerie.ordnIdMaterial =
        type === 'iccid'
          ? line.price.chipOrdnIdMaterial
          : line.price.equipmentOrdnIdMaterial;
      listSerie.skuAlt =
        type === 'iccid' ? line.price.chipSkuAlt : line.price.chipSkuAlt;
      listSerie.priceAlt =
        type === 'iccid'
          ? line.price.chipAltPrice
          : line.price.equipmentAltPrice;
      listSerie.materialAltern =
        type === 'iccid'
          ? line.price.chipAltMaterial
          : line.price.equipmentAltMaterial;
      listSerie.codeListPriceAlt =
        type === 'iccid'
          ? line.price.chipAltListCode
          : line.price.equipmentAltListCode;
    }
    listSerie.productType = (line.productType && line.productType.value) || '';
    listSerie.operationPre =
      (line.service && line.service.value) ||
      (line.productType && line.productType.value);
    if (this.isRenoRepo) {
      listSerie.codisPack =
        type === 'iccid' ? ESaleOption.Chip : ESaleOption.Phone;
      listSerie.currentSerie = line.currentSerie;
      listSerie.conversionFactor = String(
        line.claroPoints?.factorClaroClub || '0',
      );
      listSerie.discountPoints = String(line.claroPoints?.moneyReceived || '0');
      listSerie.usedPoints = String(line.claroPoints?.pointsChanged || '0');
      listSerie.grossPrice = String(
        Number(line.price.chipPriceSales) +
          Number(line.price.equipmentPriceSales),
      );
      listSerie.oldTechnology = '';
      listSerie.newTechnology = '';
      listSerie.blockFlag = line.blockData ? '1' : '0';
      listSerie.blockType = line.blockData?.blockType || '';
      listSerie.blockStatus = line.blockData?.blockstatus || '';
      listSerie.blockCode = line.blockData?.blockCode || '';
      listSerie.pointsPostpago = String(
        line.claroPoints?.promotionalDiscounts.find(
          promotional => promotional.customerType === ECustomerTypes.postpago,
        )?.points || '0',
      );
      listSerie.pointsPrepago = String(
        line.claroPoints?.promotionalDiscounts.find(
          promotional => promotional.customerType === ECustomerTypes.prepago,
        )?.points || '0',
      );
      listSerie.pointsHFC = '0';
      listSerie.pointsDTH = '0';
    } else {
      listSerie.codisPack = line.option.value;
      listSerie.coberCodDepartment = line.department?.value;
      listSerie.coberCodDistrict = line.ubigeo?.districtCode;
      listSerie.coberCodProvince = line.ubigeo?.provinceCode;
      listSerie.coberCodUbigeoINEI = line.ubigeo?.value;
      listSerie.coberDesProvince = line.ubigeo?.provinceDescription;
      listSerie.coberDesUbigeoINE = line.populatedCenter?.label;
      listSerie.coberDescDepartment = line.department?.label;
      listSerie.coberDescDistrict = line.ubigeo?.districtDescription;
      listSerie.codAssignorOperator =
        (line.operator && line.operator.value) || '';
      listSerie.codFamily = '01';
      listSerie.codPromotion = '';
      listSerie.descPromotion = '';
      listSerie.type = serie.materialType;
      listSerie.productOfferId = line.plan.productOfferId;
    }
    return listSerie;
  }

  async postGenerateDocuments(
    digitalFlag: boolean,
    customer: Customer,
    user: User,
    date?: string,
    forcePrint = false,
  ) {
    console.log("post generate documents");
    
    console.log(this.saleOperationType);
    var strProductType="";
    if(this.isRenoRepo){
      switch (this.saleOperationType) {
        case '33':
        case '03':
          console.log('saleOperationType es 03,33 o Reno');
          strProductType=JSON.parse(localStorage.getItem('ResponseLineRenewal')).productType; 
          //localStorage.setItem('ResponseLineRenewal',"");
          break;
        case '11':
        case '04':
          console.log('saleOperationType es 04,11 o Repo');
          strProductType=JSON.parse(localStorage.getItem('ResponseLineReplacement')).productType;
          //localStorage.setItem('ResponseLineReplacement',"");
          break;
      }
    }else if(this.isNewLine){
      strProductType=localStorage.getItem('productTypeId');
      //localStorage.setItem('productTypeId',"");
    }else{
      strProductType = this.productType;
    }
  
    try {
      const body = {
        secNumber: this.secNumber || '0',
        officeType: this.office.officeType,
        idOrderMSSAP: this.orderNumber,
        operation: this.saleOperationType,
        office: this.office.officeCode,
        officeSynergia: this.office.interlocutorCode,
        userAccount: user.account,
        documentType: customer.documentTypeCode,
        documentNumber: customer.documentNumber,
        segment: this.saleOperationType,
        digitalFlag: digitalFlag ? '1' : '0',
        channelCode: user.channel,
        dateFront: UTILS.formatDate(date || new Date()).replace(/\//g, ''),
        emailFlag: false,
        productType:strProductType
      };
     //registra venta
    
      const response = await this.portabilityService.postGenerateDocuments(
        body,
      );
      if (
        response &&
        (forcePrint ||
          (!forcePrint && this.signatureType === 'manual-signature') ||
          (response && this.printPdfCAC))
      ) {
        if(forcePrint){
          response.forEach(document => {
            setTimeout(() => {
              if(document.fileName !== '_2_1__1_CONS_CAM_SIMREPO.pdf'){
                this.savePDF(document.fileName, document.documentBase64);
              }
            }, 1000);
          });
        }
      }
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-904');
    }
  }

  savePDF(fileName, documentBase64) {
    const binary = atob(documentBase64.replace(/\s/g, ''));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([view], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(blob);
    if (this.isIE()) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      window.open(fileURL);
    }
  }

  showSaleError() {
    this.errorSale = {
      code: '',
      title: 'Error al grabar la venta.',
      description:
        (this.error && this.error.description) ||
        'Lo sentimos, no hemos podido grabar la venta correctamente',
      errorType: this.error.errorType,
    };
  }

  async postCancelPayment(
    user: User,
    secNumber: string,
    orderNumber: string,
    orderSinergy: string,
  ) {
    try {
      const response = await this.portabilityService.postPaymentRollback({
        secNumber: secNumber || '0',
        orderNumber: orderNumber,
        orderSinergy: orderSinergy,
        channelCode: user.channel,
        interlocutorCode: this.office.interlocutorCode,
      });
      return !!response;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-976');
      return this.error?.code === 'IDFF12' ? null : false;
    }
  }

  getLinesAdditional(): LineAdditional[] {
    const lines: LineAdditional[] = [];

    if (
      this.summaryPaymentPending.lines &&
      this.summaryPaymentPending.lines.length > 0
    ) {
      
      this.summaryPaymentPending.lines.map(item => {
        const additional = new LineAdditional(item);
        additional.salesPrice = Number(additional.salesPrice).toFixed(2);      
        additional.claroPointUsed=this.summaryPaymentPending.claroPointUsed;
        additional.discountSoles=this.summaryPaymentPending.discountSoles;
        lines.push(additional);
      });
    }

    return lines;
  }

  async validateMultipoints(body: any): Promise<boolean> {
    this.error = null;
    try {
      const response = await this.multipointService.postMultipointQuery(body);
      this.channelsFromListMultipoints = response.listMultipoint;
      this.flagMultipoint = response.flagMultipoint;
      return response.flagMultipoint === '1';
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-2000');
      return false;
    }
  }

  isIE() {
    const bw = navigator.userAgent;
    const isIE = bw.indexOf('MSIE ') > -1 || bw.indexOf('Trident/') > -1;
    return isIE;
  }
}
