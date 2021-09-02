import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Line, EAuthSupervisor } from '@customers/app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '@claro/crm/commons';
import { SupervisorAuthComponent } from '../supervisor-auth/supervisor-auth.component';
import { MessageBus } from '@claro/commons/message-bus';
@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss'],
})
export class LoyaltyComponent implements OnInit {
  @Input() lines: Line[];
  @Input() saleOperationType: string;
  @Output() sendLoyaltyDiscountAmount = new EventEmitter<string>();

  loyaltyForm: FormGroup;
  discountAmount: string;
  showFinalDiscountAmount: boolean;

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private messageBus: MessageBus,
  ) {
    this.showFinalDiscountAmount = false;
  }

  ngOnInit() {
    this.loyaltyForm = this.createLoyaltyForm();
  }

  createLoyaltyForm() {
    return this.fb.group({
      amount: [null, [Validators.required]],
    });
  }

  amountChange(amount: string) {
    this.discountAmount = amount;
  }

  async validateLoyaltyDiscount() {
    const supervisorAuth = await this.dialogService.open(
      SupervisorAuthComponent,
      {
        data: {
          option: EAuthSupervisor.Loyalty,
          operationType: this.saleOperationType,
        },
      },
    );
    if (supervisorAuth) {
      this.showFinalDiscountAmount = true;
      this.emitLoyaltyDiscount();
      this.sendLoyaltyDiscountAmount.emit(this.discountAmount);
    } else {
      this.loyaltyForm.get('amount').reset();
    }
  }

  emitLoyaltyDiscount() {
    this.messageBus.emit(
      'discountLoyaltyChannel',
      'discountLoyalty',
      this.discountAmount,
    );
  }

  edit() {
    if (this.showFinalDiscountAmount) {
      this.showFinalDiscountAmount = false;
      this.discountAmount = '0';
      this.sendLoyaltyDiscountAmount.emit(this.discountAmount);
    }
  }

  reset() {
    this.showFinalDiscountAmount = false;
    this.loyaltyForm.get('amount').reset();
    this.discountAmount = '0';
    this.emitLoyaltyDiscount();
    this.sendLoyaltyDiscountAmount.emit(this.discountAmount);
  }
}
