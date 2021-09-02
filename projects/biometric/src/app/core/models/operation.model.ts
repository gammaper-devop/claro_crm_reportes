export interface OperationResponse {
  operations: {
    idOperationType: string;
    operationName: string;
    isNewProduct: boolean;
    isEnabled: boolean;
  }[];
  warningMessage: string;
}

export class OperationType {
  operations: {
    idOperationType: string;
    operationName: string;
    isNewProduct: boolean;
    isEnabled: boolean;
  }[];
  warningMessage: string;

  constructor(operationType: OperationResponse) {
    if (operationType.operations) {
      this.operations = operationType.operations.map(type => ({
        idOperationType: type.idOperationType || '',
        operationName: type.operationName || '',
        isNewProduct: type.isNewProduct || false,
        isEnabled: type.isEnabled || false,
      }));
    }
    this.warningMessage = operationType.warningMessage
      ? operationType.warningMessage
      : '';
  }
}
