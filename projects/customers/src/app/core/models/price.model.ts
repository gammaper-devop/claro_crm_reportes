export interface PriceResponse {
  priceCode: string;
  priceDescripcion: string;
  chipPriceBase: string;
  chipPriceSales: string;
  chipSecureFlag: string;
  chipDiscount: string;
  chipAmountIgv: string;
  chipTotalPrice: string;
  equipmentPriceBase: string;
  equipmentPriceSales: string;
  equipmentSecureFlag: string;
  equipmentDiscount: string;
  equipmentAmountIgv: string;
  equipmentTotalPrice: string;

  chipOrdnIdMaterial: string;
  chipSku: string;
  chipSkuAlt: string;
  chipAltPrice: string;
  chipAltMaterial: string;
  chipAltListCode: string;
  equipmentOrdnIdMaterial: string;
  equipmentSku: string;
  equipmentSkuAlt: string;
  equipmentAltPrice: string;
  equipmentAltMaterial: string;
  equipmentAltListCode: string;
}

export class Price {
  value: string;
  label: string;
  chipPriceBase: string;
  chipPriceSales: string;
  chipSecureFlag: string;
  chipDiscount: string;
  chipAmountIgv: string;
  chipTotalPrice: string;
  equipmentPriceBase: string;
  equipmentPriceSales: string;
  equipmentSecureFlag: string;
  equipmentDiscount: string;
  equipmentAmountIgv: string;
  equipmentTotalPrice: string;

  chipOrdnIdMaterial: string;
  chipSku: string;
  chipSkuAlt: string;
  chipAltPrice: string;
  chipAltMaterial: string;
  chipAltListCode: string;
  equipmentOrdnIdMaterial: string;
  equipmentSku: string;
  equipmentSkuAlt: string;
  equipmentAltPrice: string;
  equipmentAltMaterial: string;
  equipmentAltListCode: string;

  constructor(price: PriceResponse) {
    this.value = price.priceCode ? price.priceCode : '';
    this.label = price.priceDescripcion ? price.priceDescripcion : '';
    this.chipPriceBase = price.chipPriceBase ? price.chipPriceBase : '0';
    this.chipPriceSales = price.chipPriceSales ? price.chipPriceSales : '0';
    this.chipSecureFlag = price.chipSecureFlag ? price.chipSecureFlag : '';
    this.chipDiscount = price.chipDiscount ? price.chipDiscount : '0';
    this.chipAmountIgv = price.chipAmountIgv ? price.chipAmountIgv : '0';
    this.chipTotalPrice = price.chipTotalPrice ? price.chipTotalPrice : '0';
    this.equipmentPriceBase = price.equipmentPriceBase
      ? price.equipmentPriceBase
      : '0';
    this.equipmentPriceSales = price.equipmentPriceSales
      ? price.equipmentPriceSales
      : '0';
    this.equipmentSecureFlag = price.equipmentSecureFlag
      ? price.equipmentSecureFlag
      : '';
    this.equipmentDiscount = price.equipmentDiscount
      ? price.equipmentDiscount
      : '0';
    this.equipmentAmountIgv = price.equipmentAmountIgv
      ? price.equipmentAmountIgv
      : '0';
    this.equipmentTotalPrice = price.equipmentTotalPrice
      ? price.equipmentTotalPrice
      : '0';

    this.chipOrdnIdMaterial = price.chipOrdnIdMaterial
      ? price.chipOrdnIdMaterial
      : '';
    this.chipSku = price.chipSku ? price.chipSku : '';
    this.chipSkuAlt = price.chipSkuAlt ? price.chipSkuAlt : '';
    this.chipAltPrice = price.chipAltPrice ? price.chipAltPrice : '';
    this.chipAltMaterial = price.chipAltMaterial ? price.chipAltMaterial : '';
    this.chipAltListCode = price.chipAltListCode ? price.chipAltListCode : '';
    this.equipmentOrdnIdMaterial = price.equipmentOrdnIdMaterial
      ? price.equipmentOrdnIdMaterial
      : '';
    this.equipmentSku = price.equipmentSku ? price.equipmentSku : '';
    this.equipmentSkuAlt = price.equipmentSkuAlt ? price.equipmentSkuAlt : '';
    this.equipmentAltPrice = price.equipmentAltPrice
      ? price.equipmentAltPrice
      : '';
    this.equipmentAltMaterial = price.equipmentAltMaterial
      ? price.equipmentAltMaterial
      : '';
    this.equipmentAltListCode = price.equipmentAltListCode
      ? price.equipmentAltListCode
      : '';
  }
}
