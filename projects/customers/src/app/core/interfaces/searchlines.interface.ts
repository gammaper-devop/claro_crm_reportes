export interface ISearchLines {
    flagCustomer: string;
    flagTechnology: string;
    typeHlr: string;
    iccid: string;
    contractCodePublic: string;
    blockData: IBlockData;
    blockFlag: string;
    productType: string;
    ageLine:string;
    codeOffer:string;
    idOfferDescription:string;
    idOfferPlan:string;
  }

export interface IBlockData {
  blockType: string;
  blockstatus: string;
  blockCode: string;
}
