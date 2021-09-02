import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  CanDeactivate,
} from '@angular/router';

import { CustomerService } from '../services';
import { AllowExit } from '../interfaces/allow-exit.interface';
@Injectable()
export class CustomerGuard implements CanActivate, CanDeactivate<AllowExit> {
  constructor(
    private router: Router,
    private customerService: CustomerService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.customerService.getCustomer()) {
      return true;
    } else {
      this.router.navigate(['/clientes/busqueda']);
      return false;
    }
  }

  canDeactivate(component: AllowExit) {
    return component.allowExitRoute ? component.allowExitRoute() : true;
  }
}
