import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CRMGenericsService } from '@claro/crm/commons';
import { MessageBus } from '@claro/commons/message-bus';
import { MemoryStorage } from '@claro/commons/storage';
import { CustomerService } from '@customers/app/core';
import { AuthService, User } from '@shell/app/core';
import { OperationsPresenter } from './operations.presenter';
import { Observable } from 'rxjs';
import { ConfirmService } from '@claro/crm/commons';
import { map } from 'rxjs/operators';
import { AllowExit } from '@customers/app/core/interfaces/allow-exit.interface';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.view.html',
  styleUrls: ['./operations.view.scss'],
  providers: [OperationsPresenter],
})
export class OperationsComponent implements OnInit, OnDestroy, AllowExit {
  isHiddenActive = false;
  lines: any;
  summary: any;
  isInitRoute: boolean;
  user: User;
  canExit = true;

  constructor(
    private router: Router,
    private messageBus: MessageBus,
    private customerService: CustomerService,
    public presenter: OperationsPresenter,
    private memory: MemoryStorage,
    private authService: AuthService,
    private genericsService: CRMGenericsService,
    private confirmService: ConfirmService,
  ) {
    this.user = this.authService.getUser();
    this.memory.set('oldChannel', this.user.channel);
    const office = this.genericsService.getOfficeDetail();
    this.memory.set('oldOfficeCode', office.officeCode);
  }

  ngOnInit() {
    this.isInitRoute = this.customerService.isInitRoute();
    this.customerService.validateInitRoute();
    if (this.isInitRoute) {
      return;
    }
    this.messageBus.emit('leftLinesChannel', 'leftLinesTopic', []);
    this.messageBus.emit('leftLinesChannel', 'orderNumber', '');
    this.messageBus.emit('claroPointsChannel', 'changesPoints', 0);
    this.messageBus.emit('discountLoyaltyChannel', 'discountLoyalty', '0');
  }

  hiddenActive() {
    this.isHiddenActive = !this.isHiddenActive;
  }

  goBack() {
    this.router.navigate(['/clientes/busqueda']);
  }

  emitterLines(value) {
    this.lines = value;
  }

  emitterSummary(value) {
    this.summary = value;
  }

  ngOnDestroy() {
    if (this.memory.get('oldChannel')) {
      this.user.channel = this.memory.get('oldChannel');
      this.memory.remove('oldChannel');
    }

    if (this.memory.get('oldOfficeCode')) {
      this.genericsService.getOfficeDetail(this.memory.get('oldOfficeCode'));
      this.memory.remove('oldOfficeCode');
    }
  }

  setExitPermission(canExit: boolean) {
    this.canExit = canExit;
  }

  allowExitRoute(): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.canExit && !this.memory.get('successData')) {
      return this.confirmService
        .open('exitOperation')
        .pipe(
          map(res => {
            return !!res ? true : false;
          }),
        )
        .toPromise();
    }

    return true;
  }
}
