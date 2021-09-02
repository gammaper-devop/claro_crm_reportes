import { Injectable, Input } from '@angular/core';

import { User } from '@shell/app/core';
import {
  Customer,
  ClaroPoints,
  ClaroPointsService,
  Line,
} from '@customers/app/core';
import { ClaroClub } from './claroclub';
import {
  CRMErrorService,
  EErrorType,
  ErrorCodes,
  ErrorResponse,
} from '@claro/crm/commons';

@Injectable()
export class PointsPresenter {
  @Input() lines: Line[];
  claroPoints: ClaroPoints;
  claroClub: ClaroClub;
  inputValue: number;
  currentCoins: number;
  remainingPoints: number;
  changedCoins: number;
  remainingCoins: number;
  minPoints = 11;
  minPayment = 1;
  initialPoints = 1;
  error: ErrorResponse;
  functionalError: boolean;
  flagValidateClaroPointers: boolean;
  flagValidateClaroPointersUsed: boolean;
  flagValidateShow: boolean;
  constructor(
    private claroPointsService: ClaroPointsService,
    private errorService: CRMErrorService,
  ) {}

  async getPoints(user: User, customer: Customer, numbers) {
    try {
      const body = {
        typeDocument: customer.documentTypeCode,
        numDocument: customer.documentNumber,
        clientType: user.channel,
        phoneNumber: numbers || '',
      };
      this.claroPoints = await this.claroPointsService.postPoints(body);
      this.claroClub = new ClaroClub(this.claroPoints);
      this.remainingPoints = this.claroPoints.currentPoints;
      this.currentCoins = this.claroClub.calculatePointsToCoins(
        this.claroPoints.currentPoints,
      );
      this.remainingCoins = this.currentCoins;
      this.error = null;
      this.functionalError = false;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-002');
      this.functionalError = this.error.errorType === EErrorType.Functional;
      return null;
    }
  }

  onChangeInput(addPoints: any) {
    this.inputValue = Number(addPoints.value);
    this.initialPoints = this.claroPoints.currentPoints;
    this.remainingPoints = this.claroPoints.currentPoints - this.inputValue;
    this.changedCoins = this.claroClub.calculatePointsToCoins(this.inputValue);
    this.remainingCoins =
      addPoints.value >= this.minPoints
        ? this.currentCoins - this.changedCoins
        : this.currentCoins;
    this.flagValidateClaroPointers = false;   
    this.flagValidateClaroPointersUsed = this.inputValue > this.claroClub.pointsLimit;
    this.flagValidateShow = true;
  }
}
