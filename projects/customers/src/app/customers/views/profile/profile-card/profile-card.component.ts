import { Component, Input, OnInit } from '@angular/core';

import { User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';
import { Customer } from '@customers/app/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent implements OnInit {
  @Input() user: User;
  @Input() customer: Customer;
  cdn = environment.cdn;
  isCompany: boolean;
  showProfile: boolean;
  showAddress: boolean;
  showEmail: boolean;
  showPhone: boolean;

  ngOnInit() {
    this.isCompany =
      this.customer && this.customer.documentTypeCode.toUpperCase() === 'RUC';
    this.showProfile =
      this.user.controls.find(config => config.value === 'profileShow')
        ?.flagSystem === '1';
    this.showAddress =
      this.user.controls.find(config => config.value === 'profileShowAddress')
        ?.flagSystem === '1';
    this.showEmail =
      this.user.controls.find(config => config.value === 'profileShowEmail')
        ?.flagSystem === '1';
    this.showPhone =
      this.user.controls.find(config => config.value === 'profileShowPhone')
        ?.flagSystem === '1';
  }
}
