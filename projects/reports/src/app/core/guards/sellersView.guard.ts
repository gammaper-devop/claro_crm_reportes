import { Injectable } from '@angular/core';
import {
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivate,
    CanDeactivate,
  } from '@angular/router';
import { MemoryStorage } from '@claro/commons/storage';
import { AllowExit } from '../interfaces/allow-exit.interface';

@Injectable()
export class SellersViewGuard implements CanActivate, CanDeactivate<AllowExit> {
    constructor(
        private router: Router,
        private memory: MemoryStorage
      ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log("Sellers View Guard")
        console.log("localStorage.getItem")
        if (localStorage.getItem("routerop")) {
            console.log("paso ruta")
            return true;
        }
        else {
            console.log("no pasa ruta")
            this.router.navigate(['/reportes/operaciones'])
            return false;
        }
         
    }
    canDeactivate(component: AllowExit) {
        return component.allowExitRoute ? component.allowExitRoute() : true;
      }
}