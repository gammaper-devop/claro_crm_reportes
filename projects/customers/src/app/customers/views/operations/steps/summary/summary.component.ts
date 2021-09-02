import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Office, CRMGenericsService } from '@claro/crm/commons';
import { User, EChannel } from '@shell/app/core';
import {
  Customer,
  Line,
  EFlowType,
  LineAdditional,
  EOperationType,
  ESaleOption,
} from '@customers/app/core';
import { MessageBus } from '@claro/commons/message-bus';

@Component({
  selector: 'app-summary-sale',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  @Input() user: User;
  @Input() customer: Customer;
  @Input() saleOperationType: string;
  @Input() isNewLine: boolean;
  @Input() isPortability: boolean;
  @Input() lines: Line[];
  @Input() linesAdditional: LineAdditional[];
  @Input() secNumber: string;
  @Input() flowType: string;
  @Input() isRenoRepo: boolean;
  @Input() isAlt: boolean;
  @Input() flagPicking: boolean;
  @Input() loyaltyDiscountAmount: string;
  @Output() sendCustomer = new EventEmitter<{}>();
  @Output() getProvinces = new EventEmitter<string>();
  @Output() getDistricts = new EventEmitter<{}>();
  total: string;
  isCAD: boolean;
  isReno: boolean;
  isRepo: boolean;
  lineName: string;
  isRenoRepoOption: string;
  claropoints: string;
  loyalty: string;
  echannelCAC: EChannel;
  office: Office;

  constructor(private genericsService: CRMGenericsService,private messageBus: MessageBus) {
    this.echannelCAC = EChannel.CAC;
    this.office = this.genericsService.getOfficeDetail();
  }

  ngOnInit() {
    if (this.lines[0]) {
      this.lines[0].loyaltyDiscountAmount = Number(this.loyaltyDiscountAmount);      
    }
    if (this.isRenoRepo) {
      if (this.flowType === EFlowType.NEW_FLOW && this.lines) {
        this.isRenoRepoOption = this.lines[0].typeOperation.value;
      }
    }
    this.lineName = 'Linea';
    this.isReno = EOperationType.REN === this.saleOperationType;
    this.isRepo = EOperationType.REP === this.saleOperationType;

    if (this.isRepo || this.isReno) {
      this.lineName = this.isReno
        ? this.isRenoRepoOption === ESaleOption.Phone
          ? 'Equipo'
          : 'Pack'
        : 'Chip';
      this.lineName = !this.isRenoRepoOption
        ? this.linesAdditional[0].type
        : this.lineName;
    }

    this.isCAD = this.user.channel === EChannel.CAD ? true : false;
    if (this.flowType === EFlowType.NEW_FLOW) {
      if (this.lines) {
        const total = Object.values(this.lines).reduce(
          (t, { totalPrice }) => t + Number(totalPrice),
          0,
        );
        const claropoints = this.lines[0].claroPoints?.moneyReceived || 0;
        const loyalty = this.lines[0].loyaltyDiscountAmount || 0;
        this.total = (total - claropoints - loyalty).toFixed(2);
        this.claropoints = claropoints && claropoints.toFixed(2);
        this.loyalty = loyalty && loyalty.toFixed(2);
      }
    } else {
      
      if (this.linesAdditional) {
        var Isclaropunt=this.linesAdditional.filter((x)=>x.itemType=="Equipo");
        if(Isclaropunt){
          const claropunt=   this.linesAdditional[0].discountSoles || "0";
          this.claropoints = Number(claropunt).toFixed(2);
          this.total = Object.values(this.linesAdditional)
          .reduce((t, { salesPrice }) => t + Number(salesPrice), 0)
          .toFixed(2);
          this.total=(Number(this.total)-Number(this.claropoints)).toFixed(2);
        } else{
          this.total = Object.values(this.linesAdditional)
          .reduce((t, { salesPrice }) => t + Number(salesPrice), 0)
          .toFixed(2);
         
        }
        this.messageBus.emit("leftTotalPriceChannel", "leftTotalPriceTopic", this.total);       
      }
    }
  }
}
