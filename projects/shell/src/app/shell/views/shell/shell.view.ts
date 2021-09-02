import { Component, NgZone, ViewChild } from '@angular/core';

import { EventBus } from '@claro/commons/event-bus';
import { User } from '@shell/app/core';
import { ShellPresenter } from './shell.presenter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.view.html',
  styleUrls: ['./shell.view.scss'],
  providers: [ShellPresenter],
})
export class ShellComponent {
  opened = false;
  @ViewChild('scrollMe') private myScrollContainer;

  constructor(
    private ngZone: NgZone,
    private eventBus: EventBus,
    public presenter: ShellPresenter,
    public router: Router
  ) {
    this.eventBus.$on('loginSuccess', (user: User) => {
      this.ngZone.run(() => {
        this.presenter.login(user);
      });
    });

    this.eventBus.$on('shellNavigate', (route: string) => {
      this.ngZone.run(() => {
        this.presenter.navigate(route);
      });
    });

    this.eventBus.$on('scrollTo', () => {
      setTimeout(() => {
        this.myScrollContainer.elementRef.nativeElement.scrollTop = this.myScrollContainer.elementRef.nativeElement.scrollHeight;
      });
    });

  }
  
  selectOptionMenu() {
    this.opened = false;
  }
}
