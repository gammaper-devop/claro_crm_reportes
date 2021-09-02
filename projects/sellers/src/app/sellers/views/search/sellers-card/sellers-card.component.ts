import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SellerResponse } from '@sellers/app/core/models';
import { RemoveSellerComponent } from '../remove-seller/remove-seller.component';
import { SessionStorage } from '@claro/commons/storage';
import { Router } from '@angular/router';
import { SellersCardPresenter } from './sellers-card.presenter';
import { SellerStatus, ESellerDocument } from '@sellers/app/core';
import { MessageBus } from '@claro/commons/message-bus';

@Component({
  selector: 'app-sellers-card',
  templateUrl: './sellers-card.component.html',
  styleUrls: ['./sellers-card.component.scss'],
  providers: [SellersCardPresenter],
})
export class SellersCardComponent implements OnInit, OnChanges {
  @Input() listSellers: SellerResponse[];
  @Input() listType: string;
  @Input() registerDate: [];
  showList = false;
  position: number;
  seller: SellerResponse;
  EActive: SellerStatus;
  EInactive: SellerStatus;
  ENetworkAccount: ESellerDocument;
  private optionSelected$ = new Subscription();
  isAccountNetwork: boolean;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public presenter: SellersCardPresenter,
    private sessionStorage: SessionStorage,
    private messageBus: MessageBus,
  ) {
    this.EActive = SellerStatus.Active;
    this.EInactive = SellerStatus.Inactive;
    this.ENetworkAccount = ESellerDocument.NAC;
    this.isAccountNetwork = false;
  }

  ngOnInit() {
    this.optionSelected$ = this.messageBus
      .on$('optionSelectedChannel', 'optionSelected')
      .subscribe(data => {
        this.isAccountNetwork = data === '2';
      });
  }

  ngOnChanges() {
    this.showList = false;
  }

  ngOnDestroy() {
    this.optionSelected$.unsubscribe();
  }

  showHistory(i: number) {
    this.position = i;
    this.sendSeller(i);
    if (this.listType === this.ENetworkAccount) {
      this.presenter.postSellers(
        this.seller.documentType,
        this.seller.documentNumber,
      );
      this.showList = true;
    }
  }

  async openDialog(i: number) {
    this.sendSeller(i);
    await this.dialog.open(RemoveSellerComponent, {
      data: { seller: this.seller },
    });
  }

  sellerCreateInactive(i: number) {
    const seller = this.listSellers[i];
    this.sessionStorage.set('seller-edit-data', seller);
    this.router.navigate(['/vendedores/registro']);
    delete this.listSellers[i];
  }

  edit(i: number) {
    const seller = this.listSellers[i];
    this.sessionStorage.set('seller-edit-data', seller);
    this.router.navigate(['/vendedores/registro']);
  }

  sendSeller(i: number) {
    this.seller = this.listSellers[i];
  }
}
