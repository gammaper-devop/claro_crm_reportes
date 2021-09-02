import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorResponse, CRMErrorService } from '@claro/crm/commons';
import { Seller, SellersService } from '@sellers/app/core';
import { AuthService, User } from '@shell/app/core';
import { UTILS } from '@claro/commons';
import { SellerStatus } from '@sellers/app/core';

@Component({
  selector: 'app-remove-seller',
  templateUrl: './remove-seller.component.html',
  styleUrls: ['./remove-seller.component.scss'],
})
export class RemoveSellerComponent implements OnInit {
  action: string;
  sellersResp: any;
  error: ErrorResponse;
  dataSeller: Seller;
  user: User;

  constructor(
    private sellersService: SellersService,
    private authService: AuthService,
    private errorService: CRMErrorService,
    private dialogRef: MatDialogRef<RemoveSellerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dataSeller = data.seller;
    this.user = this.authService.getUser();
  }

  ngOnInit() {}

  async deleteSeller(): Promise<Seller> {
    this.error = null;
    const body = {
      documentType: this.dataSeller.documentType,
      documentNumber: this.dataSeller.documentNumber,
      officeCode: this.user.office,
      userModification: this.user.account,
    };
    try {
      this.sellersResp = await this.sellersService.deleteSellers(body);
      this.closeDialog();
      this.changeStatus();
      this.dataSeller.account = '';
      return this.sellersResp;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-006', true);
      return error;
    }
  }

  changeStatus() {
    this.dataSeller.status = SellerStatus.Inactive;
    this.dataSeller.statusDescription = 'Inactivo';
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
