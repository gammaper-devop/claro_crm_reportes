import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MemoryStorage } from '@claro/commons/storage';
import { User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';
import { Customer, EOperationType } from '@customers/app/core';
import { IStepDetail } from '../step-detail.interface';
import { SelectOperationPresenter } from './select-operation.presenter';
import { EStepFlowName } from '../steps.enum';

@Component({
  selector: 'app-select-operation',
  templateUrl: './select-operation.component.html',
  styleUrls: ['./select-operation.component.scss'],
  providers: [SelectOperationPresenter],
})
export class SelectOperationComponent implements OnInit {
  @Input() user: User;
  @Input() customer: Customer;
  @Output() resolveStep: EventEmitter<IStepDetail> = new EventEmitter();
  @Output() operationType: EventEmitter<string> = new EventEmitter();
  @Output() hideNextBtn = new EventEmitter();
  @Output() hideReasonsCard = new EventEmitter();
  cdn = environment.cdn;
  newCustomer = false;

  constructor(
    private memory: MemoryStorage,
    public presenter: SelectOperationPresenter,
  ) {}

  async ngOnInit() {
    if (this.memory.get('newCustomer')) {
      this.memory.remove('newCustomer');
      this.newCustomer = true;
    }
    await this.presenter.getOperations(
      this.user,
      this.customer,
      this.newCustomer,
    );
    if (
      this.newCustomer &&
      this.user.configurations.find(
        config => config.key === 'portabilityByDefaultOnNewCustomer',
      )?.value === '1'
    ) {
      this.valueChanged(EOperationType.POR);
    }
  }

  valueChanged(value: string) {
    const operation = this.presenter.operations.operations.find(
      item => item.idOperationType === value,
    );
    this.hideNextBtn.emit();
    this.hideReasonsCard.emit();
    switch (operation.idOperationType) {
      case EOperationType.POR:
        this.resolveStep.emit({
          index: 2,
          flowName: EStepFlowName.portability,
        });
        break;
      case EOperationType.REN:
        this.resolveStep.emit({ index: 2, flowName: EStepFlowName.renewal });
        break;
      case EOperationType.REP:
        this.resolveStep.emit({
          index: 2,
          flowName: EStepFlowName.replacement,
        });
        break;
      case EOperationType.ALT:
        this.resolveStep.emit({
          index: 3,
          flowName: EStepFlowName.newline,
        });
        break;
      default:
        this.resolveStep.emit({ index: 3, flowName: EStepFlowName.all });
    }
    this.operationType.emit(value);
  }
}
