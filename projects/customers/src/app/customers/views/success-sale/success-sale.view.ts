import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UTILS } from '@claro/commons';
import { MemoryStorage } from '@claro/commons/storage';
import {
  CustomerService,
  ESaleOption,
  EOperationType,
} from '@customers/app/core';
import { User, AuthService, EChannel } from '@shell/app/core';

@Component({
  selector: 'app-success-sale',
  templateUrl: './success-sale.view.html',
  styleUrls: ['./success-sale.view.scss'],
})
export class SuccessSaleComponent implements OnInit {
  data: {
    name: string;
    email: string;
    phones: string[];
    saleOperationType: string;
    lineOptionValue: string;
    date: string;
    wasOmitted: string;
  };
  phones: string;
  isInitRoute: boolean;
  isChannelCAD: boolean;
  isChannelCAC: boolean;
  user: User;
  date: string;
  message = {
    main: '',
    secondaryFirst: '',
    secondarySecond: '',
  };

  constructor(
    private router: Router,
    private memory: MemoryStorage,
    private customerService: CustomerService,
    private authService: AuthService,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.isInitRoute = this.customerService.isInitRoute();
    this.customerService.validateInitRoute();
    if (this.isInitRoute) {
      return;
    }
    this.isChannelCAD = this.user.channel === EChannel.CAD;
    this.isChannelCAC = this.user.channel === EChannel.CAC;
    this.data = this.memory.get('successData');
    if (this.data) {
      if (this.data.date) {
        this.date = UTILS.formatDate(this.data.date);
      }
      this.phones = this.data.phones
        .join(', ')
        .replace(/, ([^, ]*)$/, ' y ' + '$1');
      this.memory.remove('successData');
      this.memory.remove('payments');
      this.displayMessageData();
    } else {
      this.finishAttention();
    }
  }

  displayMessageData() {
    const messagesBack = this.user.finalMessages;

    const msgRenoEquipo = messagesBack.msgRenoEquipo.split('|');
    const msgRenoPack = messagesBack.msgRenoPack.split('|');
    const msgRepo = messagesBack.msgRepo.split('|');
    const msgAlta = messagesBack.msgAlta.split('|');
    const msgAltaM1 = messagesBack.msgAltaM1.split('|');
    const msgPorta = messagesBack.msgPorta.split('|');
    const msgPortaM1 = messagesBack.msgPortaM1.split('|');

    if (this.isChannelCAC || this.data.wasOmitted) {
      this.message.main = 'El pedido se ha generado satisfactoriamente.';
    } else {
      switch (this.data.saleOperationType) {
        case EOperationType.POR:
          this.message.main = msgPorta[0];
          if (this.data?.phones.length > 1) {
            this.message.secondaryFirst = `${msgPortaM1[1]} ${this.phones} ${msgPortaM1[2]} ${this.date}.`;
            this.message.secondarySecond = msgPortaM1[3];
          } else {
            this.message.secondaryFirst = `${msgPorta[1]} ${this.phones} ${msgPorta[2]} ${this.date}.`;
            this.message.secondarySecond = msgPorta[3];
          }
          break;
        case EOperationType.ALT:
          if (this.data.phones.length > 1) {
            this.message.main = msgAltaM1[0];
            this.message.secondaryFirst = `${msgAltaM1[1]} ${this.phones} ${msgAltaM1[2]}`;
            this.message.secondarySecond = msgAltaM1[3];
          } else {
            this.message.main = msgAlta[0];
            this.message.secondaryFirst = `${msgAlta[1]} ${this.phones} ${msgAlta[2]}`;
            this.message.secondarySecond = msgAlta[3];
          }
          break;
        case EOperationType.REN:
          if (this.data.lineOptionValue === ESaleOption.Pack) {
            this.message.main = msgRenoPack[0];
          } else {
            this.message.main = msgRenoEquipo[0];
          }
          break;
        case EOperationType.REP:
          this.message.main = msgRepo[0];
          break;
        default:
          break;
      }
    }
  }

  finishAttention(): void {
    this.router.navigate(['clientes', 'busqueda']);
  }
}
