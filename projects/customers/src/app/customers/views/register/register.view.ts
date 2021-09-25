import { Component, OnInit } from '@angular/core';

import { CustomerService } from '@customers/app/core';
import { RegisterPresenter } from './register.presenter';

@Component({
  selector: 'app-profile',
  templateUrl: './register.view.html',
  styleUrls: ['./register.view.scss'],
  providers: [RegisterPresenter],
})
export class RegisterComponent implements OnInit {
  isInitRoute: boolean;

  constructor(
    private customerService: CustomerService,
    public presenter: RegisterPresenter,
  ) {}

  ngOnInit() {
    console.log("ngOnInit() RegisterComponent");
    this.isInitRoute = this.customerService.isInitRoute();
    console.log("ngOnInit() RegisterComponent isInitRoute: "+ this.isInitRoute);
    this.customerService.validateInitRoute();
    if (this.isInitRoute) {
      console.log("ngOnInit() return: ");
      return;
    }
  }
}
