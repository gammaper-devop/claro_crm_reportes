import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '@biometric/app/core';
import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-customer-card-info',
  templateUrl: './customer-card-info.component.html',
  styleUrls: ['./customer-card-info.component.scss']
})
export class CustomerCardInfoComponent implements OnInit {

  @Input() customer: Customer;
  cdn = environment.cdn;
  isCompany: boolean;

  ngOnInit() {
    this.isCompany = this.customer.documentTypeCode.toUpperCase() === 'RUC';
  }
}
