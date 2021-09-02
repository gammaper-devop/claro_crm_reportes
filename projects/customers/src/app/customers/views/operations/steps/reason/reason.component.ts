import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Line, EAuthSupervisor, EOperationType } from '@customers/app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '@claro/crm/commons';
import { ReasonPresenter } from './reason.presenter';
import { EStepNav } from '@customers/app/customers/views/operations/steps/steps.enum';
import { SupervisorAuthComponent } from '../supervisor-auth/supervisor-auth.component';
import { IStepDetail } from '../step-detail.interface';
import { IParameter } from '@customers/app/core';
import { User } from '@shell/app/core';
import { StepsPresenter } from '../steps.presenter';

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.scss'],
  providers: [ReasonPresenter, StepsPresenter],
})
export class ReasonComponent implements OnInit, OnChanges {
  @Input() lines: Line[];
  @Input() user: User;
  @Input() step: IStepDetail;
  @Input() saleOperationType: string;
  @Input() disableTgChipIn: boolean;
  @Output() resolveStep: EventEmitter<EStepNav> = new EventEmitter();
  @Output() hideLoyaltyCard = new EventEmitter<boolean>();
  @Output() hiddenFide = new EventEmitter<boolean>();

  reasonsForm: FormGroup;
  isOperationTypeRepo: boolean;
  disabledTgChips: boolean;
  constructor(
    private dialogService: DialogService,
    public presenter: ReasonPresenter,
    public stepsPresenter: StepsPresenter,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.reasonsForm = this.createReasonsForm();
    this.isOperationTypeRepo = this.saleOperationType === EOperationType.REP;
    this.hiddenFide.emit(false);
    this.disabledTgChips = false;
  }

  ngOnChanges(){
    this.disabledTgChips= this.disableTgChipIn;
  }
  createReasonsForm() {
    return this.fb.group({
      customerReason: [null, [Validators.required]],
      tgfiReason: null,
    });
  }

  changeReason(data: IParameter) {
    this.lines[0].customerReason = null;
    if (this.step.index === 2) {
      this.resolveStep.emit(EStepNav.next);
    }
    this.lines[0].customerReason = data;
  }

  async changeTgfiReason(data: IParameter) {
    console.log("changeTgfiReason",data);
    this.hiddenFide.emit(true);
    this.lines[0].tgfiReason = null;
    this.lines[0].tgfiReason = data;

    if (this.user.flagTgChipActive === '' || this.user.flagTgChipActive=='1') { 
      if (data.label === "Selecciona") {
        this.hiddenFide.emit(false);
        this.hideLoyaltyCard.emit(false);
      } else {
        const supervisorAuth = await this.dialogService.open(
          SupervisorAuthComponent,
          {
            data: {
              option: EAuthSupervisor.Reason,
              operationType: this.saleOperationType,
            },
          },
        );
        if (supervisorAuth) {
          this.lines[0].tgfiReason = data;
          this.resetSaleComponentSelects();
          this.hideLoyaltyCard.emit(true);
        } else {
          // this.resetSaleComponentSelects();
          this.lines[0].tgfiReason = null;
          this.hideLoyaltyCard.emit(false);
          this.hiddenFide.emit(false);
          this.reasonsForm.get('tgfiReason').reset();
        }
      }  
    }
  }

  resetSaleComponentSelects() {
    if (!this.lines[0].expanded) {
      this.lines[0].expanded = true;
    }

    if (this.lines[0].campaign || this.lines[0].price || this.lines[0].plan) {
      this.lines[0].campaign = null;
      this.lines[0].price = null;
      this.lines[0].plan = null;
    }
  }
}
