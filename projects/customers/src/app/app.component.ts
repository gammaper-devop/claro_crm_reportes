import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MemoryStorage, SessionStorage } from '@claro/commons/storage';
import { AuthService } from '@shell/app/core';
import { environment } from '@shell/environments/environment';

@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private memory: MemoryStorage,
    private session: SessionStorage,
    private authService: AuthService,
  ) {
    if (environment.standalone) {
      if (!this.authService.getToken()) {
        this.authService.generateToken().then(user => {
          this.authService.login(user);
        });
      }
    }
  }

  ngOnInit() {
    console.log('customers init!');
    this.memory.remove('payments');
    this.router.initialNavigation();
    const navigate = this.session.get('navigate');
    if (navigate) {
      this.router.navigate([navigate]);
      this.session.remove('navigate');
    } else {
      this.session.remove('payment-select');
      this.session.remove('payment-saleSuccess');
      if (!environment.standalone) {
        this.session.set('customersInit', true);
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(evt: KeyboardEvent) {
    if (
        evt.keyCode === 8 || evt.which === 8
    ) {
      let doPrevent = true;
      const types =['text','password','file','search','email','number','date','color','datetime','datetime-local','month','range','search','tel','time','url','week'];
      const target = (<HTMLInputElement>evt.target);

  const disabled = target.disabled || (<HTMLInputElement>event.target).readOnly;
  if (!disabled) {
    if (target.isContentEditable) {
      doPrevent = false;
    } else if (target.nodeName === 'INPUT') {
      let type = target.type;
      if (type) {
        type = type.toLowerCase();
      }
      if (types.indexOf(type) > -1) {
        doPrevent = false;
      }
    } else if (target.nodeName === 'TEXTAREA') {
      doPrevent = false;
    }
  }
  if (doPrevent) {
    evt.preventDefault();
    return false;
  }
  }
  }
}
