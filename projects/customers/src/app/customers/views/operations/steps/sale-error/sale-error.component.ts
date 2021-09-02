import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

import { ErrorResponse, EErrorType, ErrorCodes } from '@claro/crm/commons';

@Component({
  selector: 'app-sale-error',
  templateUrl: './sale-error.component.html',
  styleUrls: ['./sale-error.component.scss'],
})
export class SaleErrorComponent implements OnChanges {
  @Input() error: ErrorResponse;
  @Input() disabled: boolean;
  @Input() sale: boolean;
  @Input() saleAttemptsNumber = 3;
  @Output() clicked = new EventEmitter(null);
  disabledButton: boolean;
  attempts: number;

  constructor() {
    if (!this.disabled) {
      this.disabled = true;
    }
    this.disabledButton = false;
    this.attempts = 0;
  }

  ngOnChanges() {
    if (this.error && this.disabled) {
      this.disabledButton = this.error.errorType === EErrorType.Functional;
    }
  }

  handleClick() {
    if (this.sale) {
      if (this.attempts < this.saleAttemptsNumber) {
        this.attempts++;
        this.clicked.emit(null);
      } else {
        this.disabled = true;
        this.disabledButton = true;
        this.error.description = ErrorCodes['CRM-978'];
      }
    } else {
      this.clicked.emit(null);
    }
  }
}
