import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Menus } from '../global';
import { AuthService } from '../services';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isAuthenticated()) {
      return true;
    } else {
      const user = this.authService.getUser();
      const allowedMenus = Menus.filter(menu =>
        user.allowedModules.includes(menu.id),
      );
      this.router.navigate([`/${allowedMenus[0].url}`]);
      return false;
    }
  }
}
