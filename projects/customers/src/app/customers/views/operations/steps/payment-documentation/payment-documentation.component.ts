import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UTILS } from '@claro/commons';
import { Channels } from '@claro/crm/commons';
import { AuthService, User } from '@shell/app/core';
import {
  Customer,
  EOperationType,
  IParameter,
  Line,
  LineAdditional,
  PortabilityService,
} from '@customers/app/core';
import { PaymentDocumentationPresenter } from './payment-documentation.presenter';

@Component({
  selector: 'app-payment-documentation',
  templateUrl: './payment-documentation.component.html',
  styleUrls: ['./payment-documentation.component.scss'],
  providers: [PaymentDocumentationPresenter],
})
export class PaymentDocumentationComponent implements OnInit {
  @Input() customer: Customer;
  @Input() user: User;
  @Input() secNumber: string;
  @Input() productType: string;
  @Input() orderNumber: string;
  @Input() orderNumberSynergi: string;
  @Input() saleOperationType: string;
  @Input() totalPrice: string;
  @Input() lines: Line[];
  @Input() linesAdditional: LineAdditional[];
  @Input() email: string;
  @Input() digitalFlag: boolean;
  form: FormGroup;
  options: IParameter[];
  orderDate: number;

  position: string;
  prefix: string;
  character: string;
  maxReference: string;
  minReference: string;
  channel: string;

  constructor(
    public presenter: PaymentDocumentationPresenter,
    private portabilityService: PortabilityService,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.orderDate = new Date().getTime();
    this.initMaskInputData();
    this.maskInputNumRef();
    this.initForm();
    this.channel = Channels[this.user.channel];
  }

  initMaskInputData() {
    this.position = this.user.paymentNumber.position;
    this.prefix = this.user.paymentNumber.prefix;
    this.character = this.user.paymentNumber.character;
    this.minReference = this.user.paymentNumber.minimumSize;
    this.maxReference = this.user.paymentNumber.maximumSize;
  }

  maskInputNumRef() {
    let value = '';
    const position = Number(this.position) || 0;
    document
      .getElementById('inputNumRef')
      .addEventListener('input', (e: InputEvent) => {
        const input = e.target as HTMLInputElement;
        value = UTILS.inputMask(
          input.value,
          value,
          this.prefix,
          this.character,
          position,
        );
        input.value = value;
      });
  }

  initForm() {
    this.form = this.fb.group({
      paymentTicket: ['', Validators.required],
      referenceNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(Number(this.minReference)),
          Validators.maxLength(Number(this.maxReference)),
        ],
      ],
      storeCode: ['', [Validators.required, Validators.pattern('[0-9A-Za-z]{1,2}')]],
      boxCode: ['', [Validators.required, Validators.pattern('[0-9A-Za-z]{1,3}')]],
      ballotCode: [
        '',
        [Validators.required, Validators.pattern('[0-9A-Za-z]{1,10}')],
      ],
    });
  }

  unreadyToConfirm(): boolean {
    return this.form.invalid;
  }

  executePayment() {
    let phones: string[];
    if (this.lines.length) {
      phones = this.lines.map(line => line.phone);
    } else {
      phones = this.linesAdditional
        .filter(line => line.type === 'Equipo' || line.itemType === 'Chip')
        .map(line => line.line);
    }
    if (this.saleOperationType === EOperationType.POR) {
      this.presenter.postExecutePaymentPorta(
        this.form,
        this.customer,
        this.user,
        this.secNumber,
        this.orderNumber,
        phones,
        this.email,
        this.saleOperationType,
        this.digitalFlag,
      );
      this.postGenerateDocuments(this.digitalFlag, this.customer, this.user);
    } else if (this.saleOperationType === EOperationType.ALT) {
      this.presenter.postExecutePaymentAlta(
        this.form,
        this.customer,
        this.user,
        this.orderNumber,
        this.orderNumberSynergi,
        phones,
        this.email,
        this.saleOperationType,
        this.digitalFlag,
        this.productType,
      );
      this.postGenerateDocuments(this.digitalFlag, this.customer, this.user);
    } else if (
      this.saleOperationType === EOperationType.REN ||
      this.saleOperationType === EOperationType.REP
    ) {
      const lineOptionValue =
        this.lines[0]?.option.value ||
        ((this.linesAdditional[0]?.type === 'Pack' && 'P') || 'E');
      this.presenter.postExecutePaymentRenoRepo(
        this.form,
        this.customer,
        this.user,
        this.orderNumber,
        phones,
        this.email,
        this.saleOperationType,
        lineOptionValue,
      );
      this.postGenerateDocuments(this.digitalFlag, this.customer, this.user);
    }
  }

  async postGenerateDocuments(
    digitalFlag: boolean,
    customer: Customer,
    user: User,
    date?: string,
    forcePrint = false,
  ) {
      const body = {
        secNumber: this.secNumber || '0',
        officeType: this.user.officeData.officeType,
        idOrderMSSAP: this.orderNumber,
        operation: this.saleOperationType,
        office: this.user.officeData.officeCode,
        officeSynergia: this.user.officeData.interlocutorCode,
        userAccount: user.account,
        documentType: customer.documentTypeCode,
        documentNumber: customer.documentNumber,
        segment: this.saleOperationType,
        digitalFlag: digitalFlag ? '1' : '0',
        channelCode: user.channel,
        dateFront: UTILS.formatDate(date || new Date()).replace(/\//g, ''),
        emailFlag: true,
        productType:this.productType
      };
      const response = await this.portabilityService.postGenerateDocuments(
        body,
      );
      // if (response) {
      //   response.forEach(document => {
      //       this.savePDF(document.fileName, document.documentBase64);
      //   });
      // }
  }

  savePDF(fileName, documentBase64) {
    const binary = atob(documentBase64.replace(/\s/g, ''));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([view], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(blob);
    if (this.isIE()) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      window.open(fileURL);
    }
  }

  isIE() {
    const bw = navigator.userAgent;
    const isIE = bw.indexOf('MSIE ') > -1 || bw.indexOf('Trident/') > -1;
    return isIE;
  }
}
