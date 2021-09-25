export interface DealersResponse {
    listMainDealer: MainDealer[]
    listDealersChild: ChildDealer[]
}

export class MainDealer {
    mainDealerCode: string;
    descriptionMainDealer: string;
}

export class ChildDealer {
    dealerCodeChild: string;
    dealerDescriptionChild: string;
}

export class MainDealerParam {
    value: string;
    label: string;

    constructor(generics: MainDealer) {
        this.value = generics.mainDealerCode ? generics.mainDealerCode : '';
        this.label = generics.descriptionMainDealer ? generics.descriptionMainDealer : '';
    }
}

export class ChildDealerParam {
    value: string;
    label: string;
    constructor(generics: ChildDealer) {
        this.value = generics.dealerCodeChild ? generics.dealerCodeChild : '';
        this.label = generics.dealerDescriptionChild ? generics.dealerDescriptionChild : '';
    }
}