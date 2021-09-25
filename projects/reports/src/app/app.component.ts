import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage } from '@claro/commons/storage';
import { AuthService } from '@shell/app/core';
import { environment } from '@shell/environments/environment';

@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService,
    private session: SessionStorage) {
    if (environment.standalone) {
      if (!this.authService.getToken()) {
        this.authService.generateToken().then(user => {
          this.authService.login(user);
        });
      }
    }
  }

  ngOnInit() {
    console.log('reports init!');
    this.router.initialNavigation();
    if (!environment.standalone) {
      this.session.set('reportsInit', true);
    }
  }
}