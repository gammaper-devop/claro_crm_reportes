import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { User, EChannel } from '@shell/app/core';
import { ValidatePortabilityPresenter } from '@customers/app/customers/views/operations/steps/validate-portability/validate-portability.presenter';
import { PortabilityRequest } from '@customers/app/core/models/portability-request.model';
import { ErrorResponse } from '@claro/crm/commons';

@Component({
  selector: 'app-validate-portability',
  templateUrl: './validate-portability.component.html',
  styleUrls: ['./validate-portability.component.scss'],
  providers: [ValidatePortabilityPresenter],
})
export class ValidatePortabilityComponent implements OnInit {
  @Input() user: User;
  @Input() secNumber: string;
  @Input() orderNumber: string;
  @Input() autoFirePortability: boolean;
  @Input() error: ErrorResponse;
  @Output() portabilityIsValid: EventEmitter<boolean> = new EventEmitter();
  isValid: boolean;
  enableTryAgain: boolean;
  enableCancel: boolean;
  requestPortability: PortabilityRequest;
  attempts = 0;
  progressbarValue = 1;
  progressbarIncrement = 0;
  timeout = null;
  interval = null;
  loading = false;
  portabilityAttemptsNumber = 3;
  portabilityWaitTime = 5;
  validateCAD: boolean;

  constructor(public presenter: ValidatePortabilityPresenter) {}

  ngOnInit() {
    if (this.autoFirePortability) {
      this.validatePortability();
    }
    const attemptsNumberConfig = this.user.configurations.find(
      config => config.key === 'portabilityAttemptsNumber',
    );
    if (attemptsNumberConfig) {
      this.portabilityAttemptsNumber = Number(attemptsNumberConfig.value);
    }
    const waitTimeConfig = this.user.configurations.find(
      config => config.key === 'portabilityWaitTime',
    );
    if (waitTimeConfig) {
      this.portabilityWaitTime = Number(waitTimeConfig.value);
    }
    this.progressbarIncrement =
      100 / (this.portabilityAttemptsNumber + 1) / this.portabilityWaitTime;

    this.validateCAD = this.user.channel === EChannel.CAD;
  }

  checkTryAgain() {
    return this.enableTryAgain;
  }
  checkCancel() {
    return this.enableCancel;
  }

  async validatePortability() {
    if (this.attempts === 0) {
      this.portabilityIsValid.emit(undefined);
      this.loading = true;
      this.isValid = false;
      this.progressbarValue = 0;
    }
    const response = await this.presenter.postPortabilityRequest(
      this.secNumber,
      this.orderNumber,
    );
    if (response) {
      if (this.attempts === 0) {
        this.progressbarValue = 1;
        this.interval = setInterval(() => {
          this.progressbarValue += this.progressbarIncrement;
        }, 1000);
      }
      this.resolveResponse(response);
    } else {
      this.loading = false;
      this.enableTryAgain = true;
      this.enableCancel = false;
      this.isValid = false;
      this.portabilityIsValid.emit(false);
    }
  }

  resolveResponse(response: PortabilityRequest) {
    switch (response.codeResponse) {
      case 'NOENVIADO':
      case 'REINTENTO':
        this.retry();
        break;
      case 'DEUDA':
        this.endRetries();
        this.enableTryAgain = true;
        this.enableCancel = true;
        this.isValid = false;
        this.portabilityIsValid.emit(false);
        break;
      case 'RECHAZADO':
        this.endRetries();
        this.enableTryAgain = false;
        this.enableCancel = true;
        this.isValid = false;
        this.portabilityIsValid.emit(false);
        break;
      case 'APROBADO':
        this.endRetries();
        this.enableTryAgain = false;
        this.enableCancel = false;
        this.isValid = true;
        this.portabilityIsValid.emit(true);
        break;
    }
    this.requestPortability = response;
  }

  retry() {
    if (this.attempts < this.portabilityAttemptsNumber) {
      this.timeout = setTimeout(() => {
        this.attempts++;
        this.validatePortability();
      }, this.portabilityWaitTime * 1000);
    } else {
      this.endRetries();
      this.enableTryAgain = true;
      this.enableCancel = true;
      this.isValid = false;
      this.portabilityIsValid.emit(false);
    }
  }

  endRetries() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    this.loading = false;
    this.attempts = 0;
    this.progressbarValue = 100;
  }
}
