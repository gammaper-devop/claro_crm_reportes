import { Injectable } from '@angular/core';

import { User, AuthService } from '@shell/app/core';

@Injectable()
export class DashboardPresenter {
  user: User;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }
}
