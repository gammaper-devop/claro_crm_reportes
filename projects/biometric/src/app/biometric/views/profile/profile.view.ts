import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MemoryStorage } from '@claro/commons/storage';
import { CustomerService } from '@biometric/app/core';
import { AuthService, EChannel, User } from '@shell/app/core';
import { ProfilePresenter } from './profile.presenter';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.view.html',
  styleUrls: ['./profile.view.scss'],
  providers: [ProfilePresenter],
})
export class ProfileComponent implements OnInit {
  isInitRoute: boolean;
  isCac = true;
  user: User;
  echannelCAC: EChannel;

  constructor(
    private router: Router,
    private memory: MemoryStorage,
    private customerService: CustomerService,
    public presenter: ProfilePresenter,
    private authService: AuthService,
  ) {
    this.user = this.authService.getUser();
    this.echannelCAC = EChannel.CAC;
    this.isCac = this.user.channel === this.echannelCAC;
  }

  ngOnInit() {
    this.isInitRoute = this.customerService.isInitRoute();
    this.customerService.validateInitRoute();
    if (this.isInitRoute) {
      return;
    }
    this.presenter.payments = this.memory.get('payments');
    if (!this.presenter.payments && !this.isCac) {
      this.presenter.getPayments();
    }
  }

  goBack() {
    this.router.navigate(['/biometria']);
  }
  navegaBiometria(){
    this.router.navigate(['/biometria/clientes/validacion']);
  }
}
