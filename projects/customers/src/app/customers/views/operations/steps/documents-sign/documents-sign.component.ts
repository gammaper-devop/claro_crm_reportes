import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MemoryStorage } from '@claro/commons/storage';
import { ECustomerDocument } from '@claro/crm/commons';
import { environment } from '@shell/environments/environment';
import { Customer } from '@customers/app/core';
import { EStepNav } from '../steps.enum';
import { DocumentsSignPresenter } from './documents-sign.presenter';
import { EChannel, User } from '@shell/app/core';

@Component({
  selector: 'app-documents-sign',
  templateUrl: './documents-sign.component.html',
  styleUrls: ['./documents-sign.component.scss'],
  providers: [DocumentsSignPresenter],
})
export class DocumentsSignComponent implements OnInit, OnChanges {
  @Input() customer: Customer;
  @Input() disabled: boolean;
  @Input() stepIndex: number;
  @Input() scanBiometric: boolean;
  @Input() user: User;
  @Input() echannelCAC: EChannel;
  @Input() isRenoRepo: boolean;
  @Input() flagPicking: boolean;
  @Input() flagDelivery: boolean;
  @Output() setEmail = new EventEmitter();
  @Output() resolveNavStep: EventEmitter<EStepNav> = new EventEmitter();
  @Output() signatureType = new EventEmitter();
  @Output() checkDocumentSign = new EventEmitter();
  cdn = environment.cdn;
  documentSignForm: FormGroup;
  valueSelected: string;
  showEmail: boolean;
  sendEmail:boolean;

  constructor(
    private memory: MemoryStorage,
    private fb: FormBuilder,
    public presenter: DocumentsSignPresenter,
  ) {
    this.createForm();
    this.showEmail = false;
    this.sendEmail = false;
  }

  createForm() {
    this.documentSignForm = this.fb.group({
      email: [
        '',
        Validators.pattern(
          '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}',
        ),
      ],
    });
  }

  ngOnInit() {
    const enableDigitalSignature = !!this.scanBiometric;
    this.checkDocumentSign.emit(false);
    this.presenter.getOptionsCard(enableDigitalSignature);
    setTimeout(() => {
      this.valueChanged(this.presenter.options[0].value);
    });
  }

  get formControlEmail() {
    return this.documentSignForm.get('email') as FormControl;
  }

  ngOnChanges() {
    if (this.customer.documentTypeCode != ECustomerDocument.DNI){
      let yourControl = this.documentSignForm.get('email');
    
      let changeFormControl = yourControl.valueChanges;
      changeFormControl.subscribe(() => {
        yourControl.patchValue(yourControl.value.toUpperCase(), {emitEvent: false});
      }
      );
    }
    if (this.disabled) {
      this.presenter.options = this.presenter.options.map(option => {
        option.disabled = true;
        return option;
      });
    } else {
      if (this.presenter.options) {
        this.presenter.options = this.presenter.options.map(option => {
          option.disabled = false;
          return option;
        });
      }
    }
  }

  valueChanged(value) {
    this.valueSelected = value;
    this.signatureType.emit(value);
    let yourControl = this.documentSignForm.get('email');
    let changeFormControl = yourControl.valueChanges;
    if (value === this.presenter.digitalSignature) {
      this.showEmail = true;
      this.memory.set('is-pass-email', false);
    } else {
      //this.showEmail = false;
      const flagEmail = this.customer.documentTypeCode !== ECustomerDocument.DNI;
      if (flagEmail) {
        this.showEmail = true;
        this.sendEmail = true;
        this.memory.set('is-pass-email', false);
        this.signatureType.emit('digital-signature');
      } else {
        this.showEmail = false;
        this.memory.set('is-pass-email', true);
      }
      //this.memory.set('is-pass-email', true);
    }
    if (
      (value !== this.presenter.digitalSignature && !this.flagPicking) ||
      (value === this.presenter.digitalSignature && this.isValidEmail())
    ) {
      if (this.stepIndex === 4) {
        this.resolveNavStep.emit(EStepNav.next);
      }
      this.memory.set('is-valid-email', true);
      this.formControlEmail.reset();
      
    } else {
      changeFormControl.subscribe(() => {
        yourControl.patchValue(yourControl.value.toUpperCase(), {emitEvent: false});
      });
      this.memory.set('is-valid-email', false);
      if (this.stepIndex === 5) {
        this.resolveNavStep.emit(EStepNav.prev);
      }
    }
    this.setEmail.emit(
      value === this.presenter.digitalSignature
        ? this.formControlEmail.value
        : null,
    );
    if (this.sendEmail) {
      this.setEmail.emit(this.formControlEmail.value);
    }
  }

  private isValidEmail() {
    return this.formControlEmail.valid && !!this.formControlEmail.value;
  }

  onBlurred() {
    this.setEmail.emit(this.formControlEmail.value);
    this.memory.set('is-valid-email', this.isValidEmail());
  }

  handleEnterForInput() {
    if (this.isValidEmail()) {
      if (this.stepIndex === 4) {
        this.checkDocumentSign.emit(true);
        this.resolveNavStep.emit(EStepNav.next);
      }
      else {
        if (this.stepIndex === 5) {
          const flagEmail = this.customer.documentTypeCode !== ECustomerDocument.DNI;
          console.log("FlagEmail -->",flagEmail);
          if (flagEmail){
            this.checkDocumentSign.emit(true);  
          }
        }
      }

    } else {
      if (this.stepIndex === 5) {
        this.resolveNavStep.emit(EStepNav.prev);
      }
    }
  }

  handleNoEmailCheck(event: any) {
    this.checkDocumentSign.emit(true);
    if (event.target.checked) {
      if (this.stepIndex === 4) {
        this.resolveNavStep.emit(EStepNav.next);
        this.formControlEmail.reset();
        this.memory.set('is-valid-email', true);
        this.disabled = true;
      }
    } else {
      let yourControl = this.documentSignForm.get('email');
    
      let changeFormControl = yourControl.valueChanges;
      changeFormControl.subscribe(() => {
        yourControl.patchValue(yourControl.value.toUpperCase(), {emitEvent: false});
      }
      );
      if (this.stepIndex === 5) {
        this.resolveNavStep.emit(EStepNav.prev);
        this.memory.set('is-valid-email', false);
        this.disabled = false;
      }
    }
    this.setEmail.emit(
      event.target.checked ? null : this.formControlEmail.value,
    );
  }
}
