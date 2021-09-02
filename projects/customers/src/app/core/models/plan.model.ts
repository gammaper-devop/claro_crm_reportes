export interface PlanResponse {
  code: string;
  description: string;
  productOfferId: string;
}

export class Plan {
  value: string;
  label: string;
  productOfferId: string;

  constructor(campaign: PlanResponse) {
    this.value = campaign.code || '';
    this.label = campaign.description || '';
    this.productOfferId = campaign.productOfferId || '';
  }
}
