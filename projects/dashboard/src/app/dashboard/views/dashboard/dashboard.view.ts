import { Component, OnInit } from '@angular/core';

import { DashboardPresenter } from './dashboard.presenter';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.view.scss'],
  providers: [DashboardPresenter]
})
export class DashboardComponent implements OnInit {
  constructor(public presenter: DashboardPresenter) {}

  ngOnInit() {
    console.log('dashboard component!');
  }
}
