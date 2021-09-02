export interface ClaroPointsResponse {
  factorClaroClub: string;
  currentPoints: string;
  campaignCode: string;
  campaignDescription: string;
  promotionalDiscounts: {
    customerType: string;
    totalBalance: string;
    discountFactor: string;
    points: string;
  }[];
}

export class ClaroPoints {
  factorClaroClub: number;
  currentPoints: number;
  campaignCode: string;
  campaignDescription: string;
  promotionalDiscounts: {
    customerType: string;
    totalBalance: number;
    discountFactor: number;
    points: number;
  }[];
  pointsChanged: number;
  moneyReceived: number;

  constructor(claroPointsResponse: ClaroPointsResponse) {
    this.factorClaroClub = Number(claroPointsResponse.factorClaroClub) || 0;
    this.currentPoints = Number(claroPointsResponse.currentPoints) || 0;
    this.campaignCode = claroPointsResponse.campaignCode || '';
    this.campaignDescription = claroPointsResponse.campaignDescription || '';
    if (claroPointsResponse.promotionalDiscounts) {
      this.promotionalDiscounts = claroPointsResponse.promotionalDiscounts.map(
        points => ({
          customerType: points.customerType || '',
          totalBalance: Number(points.totalBalance) || 0,
          discountFactor: Number(points.discountFactor) || 0,
          points: Number(points.points) || 0,
        }),
      );
    }
  }
}
