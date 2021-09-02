import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

import { ErrorCodes, ErrorResponse, EErrorType } from '@claro/crm/commons';
import { Line } from '@customers/app/core';

@Injectable()
export class RenewalPresenter {
  error: ErrorResponse;

  constructor() {}

  linesSec(lines: FormArray) {
    return lines.controls.map((line, index) => {
      return {
        phone: line.value.phoneNumber,
        modalityCode: line.value.cboModOrigin.value,
        modalityDescription: line.value.cboModOrigin.label,
        order: index + 1,
        sequentialCode: line.value.sequentialCode,
      };
    });
  }

  getLines(lines: FormArray): Line[] {
    return lines.controls.map((line, index) => {
      const {
        cboService,
        cboModOrigin,
        cboRenType,
        flagCustomer,
        flagTechnology,
        currentSerie,
        contractCodePublic,
        blockData,
        blockFlag,
        unblockFlagManual,
        productType,
        typeHlr,
        phoneNumber,
        saleOptions,
        sequentialCode,
      } = line.value;
      return new Line({
        order: index + 1,
        service: cboService,
        modalityFrom: cboModOrigin,
        typeOperation: cboRenType,
        flagCustomer,
        flagTechnology,
        currentSerie,
        contractCodePublic,
        blockData,
        blockFlag,
        unblockFlagManual,
        typeHlr,
        productType,
        phone: phoneNumber,
        saleOptions,
        sequentialCode,
      } as Line);
    });
  }
}
