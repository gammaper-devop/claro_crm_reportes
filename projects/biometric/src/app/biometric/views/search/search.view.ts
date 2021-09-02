import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MemoryStorage } from '@claro/commons/storage';
import { Customer, CustomerService } from '@biometric/app/core';
//import { PaymentsCardPresenter } from '../profile/payments/payments-card.presenter';
import { SearchPresenter } from './search.presenter';

@Component({
  selector: 'app-search',
  templateUrl: './search.view.html',
  styleUrls: ['./search.view.scss'],
  providers: [ SearchPresenter],
})
export class SearchComponent implements OnInit {
  valueSearch: any;

  constructor(
    private router: Router,
    private memory: MemoryStorage,
    private customerService: CustomerService,
    public presenter: SearchPresenter,
  ) {}

  ngOnInit() {
    this.customerService.removeInitRoute();
  }

  onSubmit(form: any) {
    this.valueSearch = form;
    this.presenter.postSearch(form).then(() => {
      if (this.presenter.customers && this.presenter.customers.length === 1) {
        this.selectCustomer(this.presenter.customers[0]);
      }
    });
  }

  searchChanged() {
    this.presenter.customers = undefined;
  }

  selectCustomer(customer: Customer) {
    this.presenter.setCustomer(customer);
    this.memory.remove('payments');
    this.router.navigate(['/biometria/clientes/perfil']);
  }

  onRegister() {
    this.memory.set('searchValues', this.valueSearch);
    this.router.navigate(['/clientes/registro']);
  }
}
