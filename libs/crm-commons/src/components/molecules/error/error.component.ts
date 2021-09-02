import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

import { ErrorResponse } from 'libs/crm-commons/src/interfaces';
import { EErrorTitle, EErrorType, EErrorCode } from 'libs/crm-commons/src/enums';

@Component({
  selector: 'crm-app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnChanges {
  @Input() error: ErrorResponse;
  @Input() disabled: boolean;
  @Output() clicked = new EventEmitter(null);
  disabledButton: boolean;
  attempts: number;
  customTitle: string;

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

    if (this.error && this.error.errorType === EErrorType.Functional) {
      if (this.error.code === EErrorCode.IDFF4) {
        this.customTitle = "Respuestas Incorrectas"
        this.error.description="Superaste la cantidad de reintentos. Ir a un CAC para activar su línea";
      } else {
        this.customTitle = EErrorTitle.Functional;
      }
    } else {
      this.customTitle = this.error?.title;
    }
  }

  handleClick() {
    this.clicked.emit(null);
  }
}
