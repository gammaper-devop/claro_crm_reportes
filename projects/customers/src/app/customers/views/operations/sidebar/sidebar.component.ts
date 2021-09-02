import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageBus } from '@claro/commons/message-bus';
import { Customer, PortabilityService } from '@customers/app/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() customer: Customer;
  @Input() summary: any;
  @Output() handleBack = new EventEmitter<{}>();
  @Output() hiddenActive = new EventEmitter();

  isCompany: boolean;
  isHidden = false;
  showDeclaration = false;
  secNumber = '';
  stateDataSubject: Subscription;
  orderNumber: number;
  private messageBus$ = new Subscription();

  constructor(
    private portabilityService: PortabilityService,
    private messageBus: MessageBus,
  ) {
    this.showDeclaration = false;
    this.secNumber = null;
    this.orderNumber = null;
  }

  ngOnDestroy() {
    this.stateDataSubject.unsubscribe();
    this.messageBus$.unsubscribe();
  }

  ngOnInit() {
    this.secNumber = '';
    this.isCompany = this.customer.documentTypeCode.toUpperCase() === 'RUC';

    this.stateDataSubject = this.portabilityService.data$.subscribe(data => {
      if (data) {
        this.secNumber = data;
        this.showDeclaration = true;
      }
    });

    this.messageBus$ = this.messageBus
      .on$('leftLinesChannel', 'orderNumber')
      .subscribe(order => {
        this.orderNumber = order;
      });
  }

  goBack() {
    this.handleBack.emit();
  }

  activeIsHidden() {
    this.isHidden = !this.isHidden;
    this.hiddenActive.emit();
  }
}
