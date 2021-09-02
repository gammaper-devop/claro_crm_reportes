import { Component, OnInit } from '@angular/core';
import { LocalStorage, SessionStorage } from '@claro/commons/storage';
import { EOperationType } from '@customers/app/core';

@Component({
  selector: 'app-no-biometric-print',
  templateUrl: './no-biometric-print.component.html',
  styleUrls: ['./no-biometric-print.component.scss'],
})
export class NoBiometricPrintComponent implements OnInit {
  dataNoBioPrint: any;

  person = true;
  fullName: string;
  documentNumber: string;
  isRenoRepo: boolean;
  services: string[] = [];
  questions: any[] = [];

  disabilityReason = false;
  wornFingerprintReason = false;
  reniecIssueReason = false;

  fatherName = 'MAXIMO';
  motherName = 'FELIPA';
  district = 'JUNIN.JAUJA';

  date = new Date();

  constructor(private local: LocalStorage) {
    this.isRenoRepo = false;
    this.fullName = '';
    this.documentNumber = '';
  }

  ngOnInit() {
    this.dataNoBioPrint = this.local.get('no-biometric-print');

    if (this.dataNoBioPrint) {
      this.fullName = this.dataNoBioPrint.fullName;
      this.documentNumber = this.dataNoBioPrint.documentNumber;
      this.isRenoRepo = this.dataNoBioPrint.isRenoRepo;
      this.services = this.dataNoBioPrint.services;
      this.questions = this.dataNoBioPrint.noBiometricQuestion;
    }
  }

  print() {
    window.print();
  }
}
