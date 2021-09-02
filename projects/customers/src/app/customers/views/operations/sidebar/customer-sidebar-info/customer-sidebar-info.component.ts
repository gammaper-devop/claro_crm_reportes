import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '@customers/app/core';
import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-customer-sidebar-info',
  templateUrl: './customer-sidebar-info.component.html',
  styleUrls: ['./customer-sidebar-info.component.scss']
})
export class CustomerSidebarInfoComponent implements OnInit {

  @Input() customer: Customer;
  cdn = environment.cdn;
  isCompany: boolean;

  ngOnInit() {
    this.isCompany = this.customer.documentTypeCode.toUpperCase() === 'RUC';
  }
}
