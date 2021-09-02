import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageBus } from '@claro/commons/message-bus';
import { Seller } from '@sellers/app/core/models';
import { UTILS } from '@claro/commons';

@Component({
  selector: 'app-sellers-history',
  templateUrl: './sellers-history.component.html',
  styleUrls: ['./sellers-history.component.scss'],
})
export class SellersHistoryComponent implements OnInit, OnDestroy {
  @Input() itemHistory: Seller[];
  registerDate = [];
  unregisterDate = [];
  private optionSelected$ = new Subscription();
  isAccountNetwork: boolean;

  constructor(private messageBus: MessageBus) {
    this.isAccountNetwork = false;
  }

  ngOnInit() {
    this.optionSelected$ = this.messageBus
      .on$('optionSelectedChannel', 'optionSelected')
      .subscribe(data => {
        this.isAccountNetwork = data === '2';
      });
    if (this.itemHistory) {
      this.itemHistory.forEach((element, index) => {
        this.registerDate[index] = UTILS.formatDate(element.registerDate);
        this.unregisterDate[index] = UTILS.formatDate(element.unregisterDate);
      });
    }
  }

  ngOnDestroy() {
    this.optionSelected$.unsubscribe();
  }
}
