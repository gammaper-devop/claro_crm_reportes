import { Component, Input, OnInit } from '@angular/core';
import { Delivery } from '@customers/app/core';
import { UTILS } from '@claro/commons';

@Component({
  selector: 'app-summary-delivery',
  templateUrl: './summary-delivery.component.html',
  styleUrls: ['./summary-delivery.component.scss']
})
export class SummaryDeliveryComponent implements OnInit {
  @Input() deliveryRequest: Delivery;
  date: string;

  constructor() {}

  ngOnInit() {
    if (this.deliveryRequest.datesParameters.selectedDate) {
      this.date = UTILS.formatDate(this.deliveryRequest.datesParameters.selectedDate);
    }
  }

}
