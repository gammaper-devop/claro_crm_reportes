import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, Line } from '@customers/app/core';
import { User } from '@shell/app/core';
import { PointsPresenter } from './claro-points.presenter';
import { MessageBus } from '@claro/commons/message-bus';
import { EErrorType } from '@claro/crm/commons';
import { Subscription } from 'rxjs';
import { UTILS } from '@claro/commons';

@Component({
  selector: 'app-claro-points',
  templateUrl: './claro-points.component.html',
  styleUrls: ['./claro-points.component.scss'],
  providers: [PointsPresenter],
})
export class ClaroPointsComponent implements OnInit {
  @Input() lines: Line[];
  @Input() user: User;
  @Input() customer: Customer;
  @Output() inputValueEmit = new EventEmitter();

  inputValue: number;
  buttonsDisabled = true;
  changeViews = 0;
  moneyReceived: any;
  countPending: any;
  residuePoints: any;
  residueValuePoints: any;
  thePoints;
  pointsForm: FormGroup;
  validateTotalPrice: string;
  validateTotalPriceNumber: number;
  validateTotalPointsClaroNumber: number;
  leftLinePriceTotal = new Subscription();
  constructor(
    public presenter: PointsPresenter,
    private fb: FormBuilder,
    private messageBus: MessageBus,
  ) {
    this.pointsForm = this.fb.group({
      myPoints: [
        '',
        [
          Validators.required,
          Validators.pattern(
            `[0-9]{${presenter.minPoints.toString().length},}`,
          ),
        ],
      ],
    });
  }

  async ngOnInit() {
    this.thePoints = await this.presenter.getPoints(
      this.user,
      this.customer,
      this.lines[0]?.phone,
    );
  }

  get myPoints() {
    return this.pointsForm.get('myPoints');
  }

  changePoints() {
    this.leftLinePriceTotal = this.messageBus
      .on$('leftLinePriceTotalChannel', 'leftLinePriceTotalTopic')
      .subscribe(priceTotal => {
        let data: string = JSON.stringify(priceTotal);
        let dataPrice: DataResponseClub = JSON.parse(data);
        this.validateTotalPrice = dataPrice.data;
      });
    this.validateTotalPriceNumber = parseInt(this.validateTotalPrice);
    this.validateTotalPointsClaroNumber = this.presenter.changedCoins;

    if (this.validateTotalPriceNumber < this.validateTotalPointsClaroNumber) {
      this.presenter.flagValidateClaroPointers = true;
      this.presenter.flagValidateClaroPointersUsed = false;
      this.presenter.flagValidateShow = false;
      return;
    } else {
      this.presenter.flagValidateClaroPointers = false;
      this.inputValue = this.presenter.inputValue;
      this.changeView();
      this.dataPointsEmit();
      this.emitPointsDiscount();
    }
  }

  emitPointsDiscount() {
    this.messageBus.emit(
      'claroPointsChannel',
      'changesPoints',
      this.presenter.changedCoins,
    );
  }

  dataPointsEmit() {
    this.inputValueEmit.emit({
      ...this.presenter.claroPoints,
      pointsChanged: this.presenter.inputValue,
      moneyReceived: this.presenter.changedCoins,
    });
  }

  changeView() {
    this.changeViews = 1;
    setTimeout(() => {
      this.changeViews = 2;
      this.buttonsDisabled = false;
    }, 3000);
  }

  edit() {
    this.changeViews = 0;
    this.buttonsDisabled = true;
  }

  reset() {
    if(!UTILS.isIE()) {
      if(!this.buttonsDisabled) {
        this.resetDelete();
      }
    }
    else {
      if(!this.buttonsDisabled) {
        this.resetDelete();
      }
    }
  }

  resetDelete() {
    this.pointsForm.reset();
    this.changeViews = 0;
    this.buttonsDisabled = true;
    this.inputValue = null;
    this.presenter.remainingPoints = this.presenter.claroPoints.currentPoints;
    this.presenter.inputValue = 0;
    this.presenter.changedCoins = 0;
    this.presenter.remainingCoins =
      this.presenter.currentCoins - this.presenter.changedCoins;
    this.dataPointsEmit();
    this.emitPointsDiscount();
  }

  async again() {
    this.thePoints = await this.presenter.getPoints(
      this.user,
      this.customer,
      this.lines[0]?.phone,
    );
  }
}
interface DataResponseClub {
  data: string;
}
