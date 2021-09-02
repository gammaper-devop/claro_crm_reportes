import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from '@angular/router';

import { MemoryStorage } from '@claro/commons/storage';

@Injectable()
export class SaleGuard implements CanActivate {
  constructor(private memory: MemoryStorage, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.memory.get('successData')) {
      return true;
    } else {
      this.router.navigate(['/clientes/busqueda']);
      return false;
    }
  }
}
