import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage } from '@claro/commons/storage';
import { SearchPresenter } from './search.presenter';
import { SellerResponse } from '@sellers/app/core/models';
import { UTILS } from '@claro/commons';

@Component({
  selector: 'app-search',
  templateUrl: './search.view.html',
  styleUrls: ['./search.view.scss'],
  providers: [SearchPresenter],
})
export class SearchComponent implements OnInit {
  listSellers: SellerResponse[];
  listType: number;
  showCreateSeller: boolean;
  showError: boolean;
  registerDate = [];

  constructor(
    private router: Router,
    private sessionStorage: SessionStorage,
  ) {
    this.sessionStorage.remove('seller-edit-data');
  }

  ngOnInit() {
    this.showCreateSeller = true;
  }

  register() {
    this.router.navigate(['/vendedores/registro']);
  }

  listSellersReceived(data) {
    this.showCreateSeller = false;
    this.showError = data.list.length === 0 ? true : false;
    this.listSellers = data.list;
    this.listType = data.type;
    if (this.listSellers) {
      this.listSellers.forEach((element, index) => {
        this.registerDate[index] = UTILS.formatDate(element.registerDate);
      });
    }
  }
}
