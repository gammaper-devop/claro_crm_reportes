import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '@customers/app/core';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.scss']
})
export class CustomerCardComponent implements OnInit {
  @Input() customer: Customer;

  ngOnInit() {
  }
}
