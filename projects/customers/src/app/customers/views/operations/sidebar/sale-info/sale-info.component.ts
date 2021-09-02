import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventBus } from '@claro/commons/event-bus';
import { MessageBus } from '@claro/commons/message-bus';
import { Line } from '@customers/app/core';

@Component({
  selector: 'app-sale-sidebar-info',
  templateUrl: './sale-info.component.html',
  styleUrls: ['./sale-info.component.scss'],
})
export class SaleSidebarInfoComponent implements OnInit, OnDestroy {
  totalWithoutDiscount: number;
  lines: Line[] = [];
  flowName: string;
  private messageBusLeftLines$ = new Subscription();
  private messageBusDiscountPoints$ = new Subscription();
  private messageBusDiscountLoyalty$ = new Subscription();
  discountPoints = 0;
  discountLoyalty = 0;
  total: string;

  constructor(
    private ngZone: NgZone,
    private eventBus: EventBus,
    private messageBus: MessageBus,
  ) {}

  ngOnInit() {
    this.messageBusLeftLines$ = this.messageBus
      .on$('leftLinesChannel', 'leftLinesTopic')
      .subscribe((data: Line[]) => {
        this.lines = data;
        this.updateTotal();
      });

    this.messageBusDiscountPoints$ = this.messageBus
      .on$('claroPointsChannel', 'changesPoints')
      .subscribe((discount: number) => {
        this.discountPoints = discount;
        this.toDiscount();
      });

    this.messageBusDiscountLoyalty$ = this.messageBus
      .on$('discountLoyaltyChannel', 'discountLoyalty')
      .subscribe((discount: string) => {
        this.discountLoyalty = Number(discount);
        this.toDiscount();
      });

    this.eventBus.$on('getFlowName', (name: any) => {
      this.ngZone.run(() => {
        this.flowName = name;
      });
    });
  }

  ngOnDestroy() {
    this.messageBusLeftLines$.unsubscribe();
    this.messageBusDiscountPoints$.unsubscribe();
    this.messageBusDiscountLoyalty$.unsubscribe();
  }

  updateTotal() {
    this.totalWithoutDiscount = Object.values(this.lines).reduce(
      (t, { totalPrice }) => t + Number(totalPrice),
      0,
    );
    this.toDiscount();
  }

  toDiscount() {
    this.total = (
      this.totalWithoutDiscount -
      (this.discountPoints + this.discountLoyalty)
    ).toFixed(2);
  }

  editItem(i: number, order: number) {
    this.messageBus.emit('editLeftLineChannel', 'editLeftLineTopic', order);
    this.lines.splice(i, 1);
    this.updateTotal();
  }
}
