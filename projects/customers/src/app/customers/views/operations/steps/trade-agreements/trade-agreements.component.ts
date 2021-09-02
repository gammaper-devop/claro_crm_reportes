import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { environment } from '@shell/environments/environment';
import { TradeAgreementsPresenter } from './trade-agreements.presenter';
import { Customer } from '@customers/app/core';
import {
  debounceTime,
  distinctUntilChanged,
  take,
  takeUntil,
} from 'rxjs/operators';
import { ErrorResponse, SnackbarService } from '@claro/crm/commons';
import { IStepDetail } from '@customers/app/customers/views/operations/steps/step-detail.interface';
import { MemoryStorage } from '@claro/commons/storage';
import { EChannel } from '@shell/app/core';

@Component({
  selector: 'app-trade-agreements',
  templateUrl: './trade-agreements.component.html',
  styleUrls: ['./trade-agreements.component.scss'],
  providers: [TradeAgreementsPresenter],
})
export class TradeAgreementsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() customer: Customer;
  @Input() error: ErrorResponse;
  @Input() noMoreAttempts: boolean;
  @Input() echannelCAC: EChannel;
  @Input() isRenoRepo: boolean;
  @Output() listTradeAgreements = new EventEmitter();
  @Output() scannerFingers = new EventEmitter();
  @Output() resolveStep: EventEmitter<IStepDetail> = new EventEmitter();
  cdn = environment.cdn;

  constructor(
    public presenter: TradeAgreementsPresenter,
    private memory: MemoryStorage,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit() {
    this.presenter.getTradeAgreements(this.echannelCAC, this.isRenoRepo);
    this.formItemChanges();
  }

  ngOnChanges() {
    if (this.noMoreAttempts) {
      this.presenter.disableChecks();
    }
  }

  resetLastForm() {
    const lastForm =
      this.presenter.getFormControlTradeList().controls.length - 1;
    this.presenter.getFormControlTradeList().controls[lastForm].reset();
  }

  formItemChanges() {
    if (this.presenter.options) {
      this.presenter.options.map((opt, i) => {
        if (opt.isRequired) {
          const form = this.presenter.getFormControlTradeList().at(i);
          form.valueChanges.subscribe((value: any) => {
            if (value.tradeAgreementValue && form.enabled) {
              if (this.memory.get('is-valid-email') || this.memory.get('is-pass-email')) {
                this.listTradeAgreements.emit(
                  this.presenter.getFormControlTradeList().getRawValue(),
                );
                this.resolveStep.emit({ index: 6 });
                this.scannerFingers.emit();
                this.presenter.disabledLast();
              } else {
                this.snackbar.show('mustEnterEmail', 'warning');
              }
            }
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.presenter.onDestroy$.next();
    this.presenter.onDestroy$.complete();
  }
}
