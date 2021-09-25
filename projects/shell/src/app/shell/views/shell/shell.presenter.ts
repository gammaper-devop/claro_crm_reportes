import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { UTILS } from '@claro/commons';
import { SessionStorage } from '@claro/commons/storage';
import { User, AuthService, Menus } from '@shell/app/core';

@Injectable()
export class ShellPresenter implements OnDestroy {
  isLoggedIn$: Observable<boolean>;
  user$: Observable<User>;
  isMobile = UTILS.isMobile();
  menus = Menus;
  currentModule = '';
  currentView = '';
  isLogin = false;
  private userSubscription$ = new Subscription();
  private routerSubscription$ = new Subscription();

  constructor(
    private router: Router,
    private session: SessionStorage,
    private authService: AuthService,
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.user$ = this.authService.user;
    this.routerSubscribe();
    this.verifyACL();
  }

  routerSubscribe() {
    this.routerSubscription$ = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const urls = event.urlAfterRedirects.substring(1).split('/');
        this.currentView = urls.length > 1 ? urls[1] : '';

        if (
          UTILS.isIE() &&
          (((this.currentModule === 'dashboard' ||
          (this.currentModule === 'contratos' && event.urlAfterRedirects !== '/clientes/operaciones' )) &&
          urls[0] === 'clientes') ||
          ((this.currentModule === 'dashboard' || this.currentModule === 'clientes') && urls[0] === 'contratos'))
        ) {
          window.location.reload();
        }
        this.currentModule = urls[0];
      }
    });
  }

  verifyACL() {
    this.userSubscription$ = this.user$.subscribe(user => {
      if (user) {
        this.menus.forEach(
          menu => (menu.show = user.allowedModules.includes(menu.id)),
        );
        if (user.allowedModules.includes('customers')) {
          this.session.set('customersInit', true);
        }
        if (user.allowedModules.includes('reports')) {
          this.session.set('reportsInit', true);
        }
        if (this.isLogin) {
          this.router.navigate([
            `/${this.menus.filter(menu => menu.show)[0].url}`,
          ]);
        }
      }
    });
  }

  login(user: User) {
    this.isLogin = true;
    this.authService.login(user);
  }

  navigate(route: string) {
    console.log(route);
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.routerSubscription$.unsubscribe();
    this.userSubscription$.unsubscribe();
  }
}
