import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { ErrorResponse, Biometric, ErrorCodes } from '@claro/crm/commons';
import { User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-biometric-step',
  templateUrl: './biometric-step.component.html',
  styleUrls: ['./biometric-step.component.scss'],
})
export class BiometricStepComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() biometric: Biometric;
  @Input() scanStatus: boolean;
  @Input() error: ErrorResponse;
  @Output() scanned = new EventEmitter<{}>();
  @Output() submitted = new EventEmitter<{}>();
  form: FormGroup;
  cdn = environment.cdn;
  showScanFingerprint = true;
  isFirstTime = true;
  scanMessage: string;
  leftHand: string;
  rightHand: string;
  isScanning = false;
  scanIcon: string;

  constructor(
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {
    this.form = this.formBuilder.group({
      biometric: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.scanStatus = null;
    if (this.biometric) {
      this.scanMessage = `Coloca el dedo ${this.biometric.bestFingerpintLeft.label} o ${this.biometric.bestFingerpintRight.label} en el lector biometrico`;
      const leftFinger = this.biometric.bestFingerpintLeft.value.substr(-2);
      this.leftHand = `url('${this.cdn}/img/login/biometric-hand-${leftFinger}.svg')`;
      const rightFinger = this.biometric.bestFingerpintRight.value.substr(-2);
      this.rightHand = `url('${this.cdn}/img/login/biometric-hand-${rightFinger}.svg')`;
    } else {
      this.scanMessage = `Coloque su dedo en el lector biometrico`;
      this.leftHand = `url('${this.cdn}/img/login/biometric-hand.svg')`;
      this.rightHand = `url('${this.cdn}/img/login/biometric-hand.svg')`;
    }
  }

  ngOnChanges() {
    if (this.scanStatus !== null) {
      this.isScanning = false;
      this.scanIcon = this.scanStatus ? 'done' : 'close';
    }
  }

  scanFingerprint() {
    this.error = null;
    this.isScanning = true;
    this.isFirstTime = false;
    this.scanned.emit();
  }

  onSubmit() {
    this.submitted.emit({
      userAccount: this.user.account,
      channelCode: this.user.channel,
      documentType: this.user.documentType,
      documentNumber: this.user.documentNumber,
      officeSale: this.user.office,
      secNumber: '0',
      footPrintImage: this.biometric.fingerprintImage,
      templateFootPrint: this.biometric.fingerprintValue,
      validationType: 'V',
      validationVerification: '1',
      idBioParent: this.biometric.parent,
      operationType: 'LO',
      actionType: 'A',
    });
  }
}
