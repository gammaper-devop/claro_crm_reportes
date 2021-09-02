import { Component, Input, OnChanges } from '@angular/core';

import { MemoryStorage } from '@claro/commons/storage';
import {
  ConfirmService,
  SnackbarService,
  Messages,
  ErrorResponse,
  CRMErrorService,
  ECustomerDocument,
} from '@claro/crm/commons';
import { User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';
import { Customer, PaymentPending } from '@customers/app/core';
import { PaymentsCardPresenter } from './payments-card.presenter';

@Component({
  selector: 'app-payments-card',
  templateUrl: './payments-card.component.html',
  styleUrls: ['./payments-card.component.scss'],
  providers: [PaymentsCardPresenter],
})
export class PaymentsCardComponent implements OnChanges {
  @Input() user: User;
  @Input() customer: Customer;
  @Input() payments: PaymentPending[];
  @Input() error: ErrorResponse;
  loading: any;
  cdn = environment.cdn;

  constructor(
    private memory: MemoryStorage,
    private confirmService: ConfirmService,
    private snackbarService: SnackbarService,
    public presenter: PaymentsCardPresenter,
    private errorService: CRMErrorService,
  ) {}

  ngOnChanges() {
    if (this.error) {
      this.errorService.showError(this.error);
    }
  }

  deleteRow(
    index: number,
    secNumber: string,
    orderNumber: string,
    orderNumberSynergi: string,
  ) {
    this.confirmService.open('cancelOperation').subscribe(response => {
      if (response) {
        let message = Messages.cancelPaymentError.replace('XXX', orderNumber);
        this.presenter
          .postCancelPayment(
            secNumber || '0',
            orderNumber,
            orderNumberSynergi,
            this.user.channel,
          )
          .then((resp: boolean) => {
            if (resp) {
              message = Messages.cancelPaymentSuccess.replace(
                'XXX',
                orderNumber,
              );
              this.snackbarService.show(message, 'success');
              this.payments.splice(index, 1);
              this.memory.set('payments', this.payments);
            } else if (resp === false) {
              this.snackbarService.show(message, 'error');
            }
          })
          .catch(() => {
            this.snackbarService.show(message, 'error');
          });
      }
    });
  }

  async payNav(payment: PaymentPending) {
    const detailPayment = await this.presenter.getDetailPayment(
      payment.orderNumber,
      payment.typeDocument,
    );
    if (!detailPayment) {
      return;
    }
    this.presenter.payNav(payment);
  }

  async openFiles(orderNumber: string, orderType: string, date: string) {
    const detailPayment = await this.presenter.getDetailPayment(
      orderNumber,
      orderType,
    );
    if (!detailPayment) {
      return;
    }
    await this.presenter.postGenerateDocuments(
      this.customer,
      this.user,
      detailPayment,
      date,
    );
  }
}
