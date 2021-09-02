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
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getUser();
      let routeAllowed = true;
      const allowedMenus = Menus.filter(menu =>
        user.allowedModules.includes(menu.id),
      );
      const currentMenu = Menus.find(menu => state.url.includes(menu.url));
      routeAllowed = user.allowedModules.includes(currentMenu.id);
      if (!routeAllowed) {
        this.router.navigate([`/${allowedMenus[0].url}`]);
      }
      return routeAllowed;
    } else {
      this.authService.logout();
      return false;
    }
  }
}
