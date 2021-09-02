import { Component, OnInit } from '@angular/core';

import { environment } from '@shell/environments/environment';
import { LoginPresenter } from './login.presenter';

@Component({
  selector: 'app-login',
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.scss'],
  providers: [LoginPresenter],
})
export class LoginComponent implements OnInit {
  cdn = environment.cdn;

  constructor(public presenter: LoginPresenter) {}

  ngOnInit() {}
}
