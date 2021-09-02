export interface CampaignResponse {
  campaingCode: string;
  campaingDescription: string;
  promotion: string;
  sapCode: string;
  type: string;
}

export class Campaign {
  value: string;
  label: string;
  promotion: string;
  sapCode: string;
  type: string;

  constructor(campaign: CampaignResponse) {
    this.value = campaign.campaingCode ? campaign.campaingCode : '';
    this.label = campaign.campaingDescription
      ? campaign.campaingDescription
      : '';
    this.promotion = campaign.promotion ? campaign.promotion : '';
    this.sapCode = campaign.sapCode ? campaign.sapCode : '';
    this.type = campaign.type ? campaign.type : '';
  }
}
