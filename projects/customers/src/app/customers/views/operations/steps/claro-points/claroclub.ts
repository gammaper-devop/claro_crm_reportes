enum CustomerTypes {
  'postpago' = '2',
  'prepago' = '3',
}

interface ClaroPoints {
  factorClaroClub: number;
  currentPoints: number;
  promotionalDiscounts: {
    customerType: string;
    totalBalance: number;
    discountFactor: number;
    points: number;
  }[];
}

export class ClaroClub {
  private claroPoints: ClaroPoints;
  private claroPointsData = {
    response: 0,
    fEqPOSTPAGO: 0,
    fEqPREPAGO: 0,
    fEqCoins: 0,
    postpagoPoints: 0,
    totalPoints: 0,
  };
  pointsLimit: number;
  constructor(claroPoints: ClaroPoints) {
    this.claroPoints = claroPoints;
  }

  calculatePointsToCoins(userPoints: number): number {
    if (!this.claroPoints) {
      return 0;
    }
    this.calculatePostpago(userPoints);
    if (!this.claroPointsData.response) {
      this.calculatePrepago(userPoints);
      if (!this.claroPointsData.response) {
        this.calculateOthers(userPoints);
      }
    }
    this.pointsLimit = this.claroPointsData.totalPoints;
    return this.claroPointsData.response;
  }

  private calculatePostpago(userPoints: number) {
    let promotionalDiscount = this.claroPoints.promotionalDiscounts.find(
      promotional => promotional.customerType === CustomerTypes.postpago,
    );
    if (promotionalDiscount) {
      this.claroPointsData.totalPoints = promotionalDiscount.points;
      this.claroPointsData.postpagoPoints = promotionalDiscount.points;
      if (this.claroPointsData.postpagoPoints > userPoints) {
        this.claroPointsData.response = Math.ceil(
          userPoints *
            this.claroPoints.factorClaroClub *
            promotionalDiscount.discountFactor,
        );
      } else if (
        Math.ceil(this.claroPointsData.postpagoPoints) === userPoints
      ) {
        this.claroPointsData.response = Math.ceil(
          promotionalDiscount.totalBalance,
        );
      } else {
        this.claroPointsData.fEqPOSTPAGO = promotionalDiscount.totalBalance;
      }
    } else {
      promotionalDiscount = this.claroPoints.promotionalDiscounts.find(
        promotional => promotional.customerType === CustomerTypes.prepago,
      );
      if (promotionalDiscount) {
        this.claroPointsData.totalPoints = promotionalDiscount.points;
        this.claroPointsData.response = Math.ceil(
          userPoints *
            this.claroPoints.factorClaroClub *
            promotionalDiscount.discountFactor,
        );
      }
    }
  }

  private calculatePrepago(userPoints: number) {
    let promotionalDiscount = this.claroPoints.promotionalDiscounts.find(
      promotional => promotional.customerType === CustomerTypes.prepago,
    );
    if (promotionalDiscount) {
      this.claroPointsData.totalPoints = promotionalDiscount.points;
      this.claroPointsData.fEqPREPAGO =
        (userPoints - this.claroPointsData.postpagoPoints) *
        this.claroPoints.factorClaroClub *
        promotionalDiscount.discountFactor;
      if (
        Math.ceil(promotionalDiscount.totalBalance) >=
        this.claroPointsData.fEqPREPAGO
      ) {
        this.claroPointsData.response = Math.ceil(
          this.claroPointsData.fEqPOSTPAGO + this.claroPointsData.fEqPREPAGO,
        );
      } else {
        this.claroPointsData.fEqPREPAGO = promotionalDiscount.totalBalance;
      }
      this.claroPointsData.totalPoints =
        this.claroPointsData.postpagoPoints + promotionalDiscount.points;
      this.claroPointsData.fEqCoins =
        this.claroPointsData.fEqPOSTPAGO + this.claroPointsData.fEqPREPAGO;
    } else {
      promotionalDiscount = this.claroPoints.promotionalDiscounts.find(
        promotional => promotional.customerType === CustomerTypes.postpago,
      );
      if (promotionalDiscount) {
        this.claroPointsData.totalPoints = promotionalDiscount.points;
        this.claroPointsData.fEqCoins = this.claroPointsData.fEqPOSTPAGO;
      }
    }
  }

  private calculateOthers(userPoints: number) {
    const promotionalDiscounts = this.claroPoints.promotionalDiscounts.filter(
      promotional =>
        promotional.customerType !== CustomerTypes.postpago &&
        promotional.customerType !== CustomerTypes.prepago,
    );
    for (const promotionalDiscount of promotionalDiscounts) {
      const fEqOthers =
        (userPoints - this.claroPointsData.totalPoints) *
        this.claroPoints.factorClaroClub *
        promotionalDiscount.discountFactor;

      if (promotionalDiscount.totalBalance >= fEqOthers) {
        this.claroPointsData.response = Math.ceil(
          this.claroPointsData.fEqCoins + fEqOthers,
        );
        break;
      } else {
        this.claroPointsData.totalPoints += promotionalDiscount.points;
        this.claroPointsData.fEqCoins += promotionalDiscount.totalBalance;
      }
    }
  }
}
