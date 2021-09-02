import { Injectable } from '@angular/core';

import { SnackbarService } from '../components/molecules/snackbar/snackbar.service';
import { EErrorTitle, EErrorType } from '../enums';
import { ErrorCodes } from '../global';
import { ErrorResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CRMErrorService {
  error: ErrorResponse;

  constructor(private snackbarService: SnackbarService) {}

  showError(
    error: ErrorResponse,
    code?: string,
    snackBar?: boolean,
  ): ErrorResponse {
    if (error.errorType === EErrorType.Functional) {
      this.error = error;
    } else {
      if (code) {
        error.code = code;
        error.description = ErrorCodes[code];
      }
      this.error = error;
    }
    if (snackBar) {
      this.snackbarService.show(this.error.description, 'error');
    }
    return this.error;
  }

  showFunctionalError(code: string) {
    this.error = {
      code: code,
      title: EErrorTitle.Functional,
      description: ErrorCodes[code],
      errorType: EErrorType.Functional,
    };
    return this.error;
  }
}
