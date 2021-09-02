export interface ILineAdditional {
  documentSap: string;
  itemType: string;
  line: string;
  materialDescrip: string;
  numberSec: string;
  operationType: string;
  plan: string;
  prepaidProduct: string;
  promotion: string;
  salesPrice: string;
  secuential: string;
  type: string;
  iccid: string;
  productType: string;
  sku: string;
}

export class LineAdditional {
  documentSap: string;
  itemType: string;
  line: string;
  materialDescrip: string;
  numberSec: string;
  operationType: string;
  plan: string;
  prepaidProduct: string;
  promotion: string;
  salesPrice: string;
  secuential: string;
  type: string;
  iccid: string;
  productType: string;
  sku: string;
  claroPointUsed:string;
  discountSoles:string;

  constructor(Iline: ILineAdditional) {
    this.documentSap = Iline.documentSap;
    this.itemType = Iline.itemType;
    this.line = Iline.line;
    this.materialDescrip = Iline.materialDescrip;
    this.numberSec = Iline.numberSec;
    this.operationType = Iline.operationType;
    this.plan = Iline.plan;
    this.prepaidProduct = Iline.prepaidProduct;
    this.promotion = Iline.promotion;
    this.salesPrice = Iline.salesPrice;
    this.secuential = Iline.secuential;
    this.type = Iline.type;
    this.iccid = Iline.iccid;
    this.productType = Iline.productType;
    this.sku = Iline.sku;
  }
}
