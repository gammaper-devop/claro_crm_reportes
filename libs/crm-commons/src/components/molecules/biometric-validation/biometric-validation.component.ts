import {
  OnInit,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import {
  BiometricBody,
  BiometricConfig,
  Person,
  SecurityQuestionService,
} from '../../../models';
import { environment } from '@shell/environments/environment';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BiometricValidationPresenter } from './biometric-validation.presenter';
import { DialogService } from '../dialog/dialog.service';
import { EventBus } from '@claro/commons/event-bus';
import { BiometricConfirmsComponent } from './biometric-confirms/biometric-confirms.component';
import { EErrorCode } from 'libs/crm-commons/src/enums';
import { ErrorResponse } from 'libs/crm-commons/src/interfaces';

@Component({
  selector: 'crm-biometric-validation',
  templateUrl: './biometric-validation.component.html',
  styleUrls: ['./biometric-validation.component.scss'],
  providers: [BiometricValidationPresenter],
})
export class BiometricValidationComponent implements OnInit, OnChanges {
  @Output() biometricScanEmit = new EventEmitter();
  @Output() omissionBiometric = new EventEmitter();
  @Output() questionsAnswer = new EventEmitter();
  @Output() leaveEmit = new EventEmitter();
  @Input() body: BiometricBody;
  @Input() biometricType: string;
  @Input() biometricConfig: BiometricConfig = {
    inabilityFlag: true,
    noBiometricFlag: false,
    noBiometricMaxAttemptsNumber: 3,
    inabilityButton: 'No Biometría',
    inabilityMessage:
      'La No Biometría es cuando el usuario se encuentra imposibilitado para validar sus huellas.',
    omissionFlag: false,
    omissionButton: 'Omitir',
    omissionConfirm: 'Omisión de validación del cliente',
    lastAttemptMessage:
      'Este es el último intento, de fallar comuníquese con el área especializada.',
    verificationBiometricType: '2',
  };
  @Output() errorEmit = new EventEmitter();
  @Output() isSellersNoBiometricEmit = new EventEmitter();
  form: FormGroup;
  noBiometricForm: FormGroup;
  cdn = environment.cdn;
  leftHand: string;
  rightHand: string;
  scanIcon: string;
  scanMessage: string;
  noBiometric: boolean;
  noBiometricAttempts: number;
  personResponse: Person;
  answers: SecurityQuestionService[];
  isSellersNoBiometric: boolean;
  validClientsBlockedArray: IClientErrorValid[] = [];
  validClientsBlockedArrayResponse: IClientErrorValid[] = [];
  retryScanning: boolean;
  disableToogle: boolean;
  // isLicenseActivated = true;
  enableButtonInLicensing = true;
  valueBiometricMessage: string;
  validQuestion:boolean;
  constructor(
    public fb: FormBuilder,
    public presenter: BiometricValidationPresenter,
    private dialogService: DialogService,
    private eventBus: EventBus,
  ) {
    this.form = this.fb.group({
      biometricForm: ['', Validators.required],
    });
    this.noBiometricForm = this.fb.group({
      questions: this.fb.array([]),
    });

    this.noBiometric = false;
    this.isSellersNoBiometric = false;
    this.retryScanning = false;
    this.disableToogle = false;
    this.validQuestion = false;
  }

  ngOnInit() {
    this.noBiometric = this.biometricConfig?.noBiometricFlag;
    this.getBestFingerprint();
    this.isSellersAndNoBiometric();
    let validBlockedClient = localStorage.getItem('errorValidClientArray');

    if (this.noBiometric) {
      if (validBlockedClient !== null) {

        let validClientsBlockedArrayResponse = JSON.parse(validBlockedClient);
        this.validClientsBlockedArray = validClientsBlockedArrayResponse;
        let errorFilter = validClientsBlockedArrayResponse.filter(item => item.documentNumber === this.body.person.documentNumber)[0];

        if (errorFilter !== null) {
          if (errorFilter.documentNumber === this.body.person.documentNumber) {
            this.presenter.error = errorFilter.errorResponse;
            this.presenter.questionsError = true;
          }
        }

      }
    }
  }

  isSellersAndNoBiometric() {
    this.isSellersNoBiometric = this.biometricType === 'sellers' && this.noBiometric === true;
    if (this.isSellersNoBiometric) {
      this.isSellersNoBiometricEmit.emit(true);
    } else {
      this.isSellersNoBiometricEmit.emit(false);
    }
  }

  async getBestFingerprint() {
    await this.presenter.getBestFingerprint(this.body, this.biometricConfig);
    if (this.presenter.errorBiometric) {
      return;
    }
    this.initBiometric();
    this.noBiometricAttempts = this.biometricConfig?.noBiometricMaxAttemptsNumber;
    if (this.biometricConfig?.noBiometricFlag) {
      this.noBiometric = true;
      this.getSecurityQuestions();
    }
    //  } else {
    //     this.scanFingers();
    //   }
  }

  ngOnChanges() {
    if (this.presenter.isScanning !== null) {
      this.scanIcon = 'close';
    }
  }

  async getSecurityQuestions() {
    try {
      await this.presenter.getQuestions(this.body);
      this.addControlsOptions();
    } catch (error) {
      console.log(error);
      this.errorEmit.emit("error");
    }
  }

  initBiometric() {
    if (this.presenter.biometric) {
      this.scanMessage = `Coloca el dedo <strong>${this.presenter.biometric.bestFingerpintLeft.label} o ${this.presenter.biometric.bestFingerpintRight.label}</strong> en el lector biometrico`;
      const leftFinger = this.presenter.biometric.bestFingerpintLeft.value.substr(
        -2,
      );
      this.leftHand = `url('${this.cdn}/img/login/biometric-hand-${leftFinger}.svg')`;
      const rightFinger = this.presenter.biometric.bestFingerpintRight.value.substr(
        -2,
      );
      this.rightHand = `url('${this.cdn}/img/login/biometric-hand-${rightFinger}.svg')`;
    } else {
      this.scanMessage = `Coloque su dedo en el lector biometrico`;
      this.leftHand = `url('${this.cdn}/img/login/biometric-hand.svg')`;
      this.rightHand = `url('${this.cdn}/img/login/biometric-hand.svg')`;
    }
  }

  async scanFingers() {
    if (!this.body.errorSale) {
      if (this.body.scanBiometric) {
        if (
          !this.presenter.noMoreAttempts &&
          !this.presenter.successfulBiometric
        ) {
          const biometricExists = !!this.presenter.biometric;
          this.body.saleSuccess = undefined;
          if (this.presenter.biometric) {
            this.disableToogle = true;
            this.eventBus.$emit('scrollTo');
            setTimeout(
              () => {
                this.eventBus.$emit('scrollTo');
                this.initScan();
              },
              !biometricExists ? 3000 : 0,
            );
          }
        }
      } else {
        this.eventBus.$emit('scrollTo');
      }
    }
  }

  async initScan() {
      const scanSuccess = await this.presenter.scanFingers(this.body, this.biometricConfig, this.biometricType);
      if (scanSuccess) {
        this.eventBus.$emit('scrollTo');
        await this.biometricScanEmit.emit({
          success: true,
          person: this.presenter.newPerson,
          idBioParent: this.presenter.biometric.parent,
          passedFingersScan: true,
        });
      }
      if (this.presenter.errorBiometric?.code === '19003') {
        this.enableButtonInLicensing = false;
        const licenseActivatedresponse = await this.presenter.getLinceseBiometric(this.body, this.biometricConfig);
        if (licenseActivatedresponse) {
          this.presenter.errorBiometric = null;
          const scanSuccess = await this.presenter.scanFingers(this.body, this.biometricConfig, this.biometricType);
          if (scanSuccess) {
            this.eventBus.$emit('scrollTo');
            await this.biometricScanEmit.emit({
              success: true,
              person: this.presenter.newPerson,
              idBioParent: this.presenter.biometric.parent,
              passedFingersScan: true,
            });
          }
          this.enableButtonInLicensing = true;
          this.retryScanning = true;
        }
      }
      if (this.presenter.errorBiometric !== null) {
        this.retryScanning = true;
        this.disableToogle = false;
      }
      this.errorEmit.emit(this.presenter.errorBiometric);
      if (this.presenter.errorBiometric?.code === 'CRM-977') {
        this.biometricConfig.inabilityFlag = false;
      }
  }

  addControlsOptions() {
    this.presenter.questions.forEach(question => {
      const questions = this.noBiometricForm.get('questions') as FormArray;
      questions.push(this.newQuestion(question));
    });
    if (this.presenter.questions && this.presenter.questions.length > 0) {
      console.log(this.validQuestion);
      if (this.validQuestion) {
        this.dialogService.open(BiometricConfirmsComponent, {
          data: {
            title: 'Recuerda',
            description: this.biometricConfig?.inabilityMessage,
            aggree: 'Entendido',
            disagree: '',
            cancel: false,
          },
        });
      }
    }
  }

  newQuestion(value): FormGroup {
    return this.fb.group({
      question: value.question,
      questionNumber: value.questionNumber,
      answer: value.answer,
      option: '',
      optionNumber: [null, Validators.required],
    });
  }

  replaceAll(option: string, search: string, replace: string) {
    return option.split(search).join(replace);
  }

  getQuestions(): FormArray {
    return this.noBiometricForm.get('questions') as FormArray;
  }

  changeSwitch(ev: boolean) {
    this.noBiometric = !this.noBiometric;
    this.isSellersAndNoBiometric();
    let validBlockedClient = localStorage.getItem('errorValidClientArray');

    if (validBlockedClient!==null) {
      let validClientsBlockedArrayResponse = JSON.parse(validBlockedClient);
      let errorFilter = validClientsBlockedArrayResponse.filter(item => item.documentNumber === this.body.person.documentNumber)[0];

      if(errorFilter.documentNumber === this.body.person.documentNumber) {
        this.presenter.error = errorFilter.errorResponse;
        this.presenter.questionsError = true;
      }
    }
    if (ev == true) {
      this.validQuestion = true;
      console.log("this.validQuestion",this.validQuestion);
      if (ev == this.noBiometric) {
        this.getSecurityQuestions();
      }
      // if (this.presenter.error !== null) {
      //   if(this.presenter.error.code !== EErrorCode.IDFF4){
      //     console.log("error");
      //     this.dialogService.open(BiometricConfirmsComponent, {
      //       data: {
      //         title: 'Recuerda',
      //         description: this.biometricConfig?.inabilityMessage,
      //         aggree: 'Entendido',
      //         disagree: '',
      //         cancel: false,
      //       },
      //     });
      //   }
      // } 
    } else {
      this.validQuestion = false;
      //this.scanFingers();
    }
  }

  async submitQuestions() {
    if (this.noBiometricAttempts > 0) {
      this.answers = this.noBiometricForm.value.questions;
      this.presenter.questions.forEach((question, index) => {
        question.listOption.forEach(opt => {
          if (opt.optionNumber === this.answers[index].optionNumber) {
            this.answers[index].option = opt.option;
          }
        });
      });
      this.personResponse = await this.presenter.submitNonBiometric(
        this.body,
        this.answers,
        this.biometricConfig?.noBiometricMaxAttemptsNumber -
          this.noBiometricAttempts +
          1,
      );
      this.validQuestion = false;
      if (!this.personResponse) {
        this.errorEmit.emit(this.presenter.error);
        if (this.presenter.error &&
          (this.presenter.error.code === EErrorCode.IDFF1 ||
            this.presenter.error.code === EErrorCode.IDFF2 ||
            this.presenter.error.code === EErrorCode.IDFF3)) {
          this.presenter.questionsError = true;
          return;
        }
        const form = this.noBiometricForm.get('questions') as FormArray;
        form.clear();
        await this.getSecurityQuestions();
        if (this.presenter.error &&
          this.presenter.error.code === EErrorCode.IDFF4) {
          this.errorEmit.emit(this.presenter.error);
          this.presenter.questionsError = true;
          return;
        }
        this.noBiometricAttempts -= 1;
        const attempt = await this.dialogService.open(
          BiometricConfirmsComponent,
          {
            data: {
              title: 'Respuesta incorrecta',
              description:
                this.noBiometricAttempts > 1
                  ? `Solo le quedan ${this.noBiometricAttempts} intentos`
                  : this.noBiometricAttempts > 0
                    ? this.biometricConfig?.lastAttemptMessage
                    : 'No cuenta con mas intentos',
              aggree: this.noBiometricAttempts > 0 ? 'Entendido' : 'Salir',
              disagree: '',
              cancel: false,
            },
          },
        );
        if (attempt && this.noBiometricAttempts === 0) {
          let errorClientValid = new IClientErrorValid(this.body.person.documentNumber, this.presenter.error);
          this.validClientsBlockedArray.push(errorClientValid);
          localStorage.setItem('errorValidClientArray', JSON.stringify(this.validClientsBlockedArray));
          this.leaveEmit.emit();
        }
        return;
      } else {
        this.presenter.successfulBiometric = true;
        this.questionsAnswer.emit(this.answers);
        await this.biometricScanEmit.emit({
          success: true,
          person: this.presenter.newPerson,
          idBioParent: this.presenter.biometric.parent,
          passedFingersScan: false,
        });
      }
    }
  }

  async biometricOmission() {
    if (!this.body.flagBio && this.body.omissionRequired) {
      const omissionSuccess = await this.dialogService.open(
        BiometricConfirmsComponent,
        {
          data: {
            title: 'Omisión',
            description: this.biometricConfig?.omissionConfirm,
            aggree: 'Sí',
            disagree: 'No',
            cancel: true,
          },
        },
      );
      if (omissionSuccess) {
        this.omissionBiometric.emit(omissionSuccess);
        await this.biometricScanEmit.emit({
          success: true,
          omitted: true,
          idBioParent: this.presenter.biometric?.parent || '',
          passedFingersScan: false,
        });
      }
    } else {
      await this.dialogService.open(BiometricConfirmsComponent, {
        data: {
          title: 'Alerta',
          description: this.biometricConfig?.omissionConfirm,
          aggree: 'Entendido',
          disagree: '',
          cancel: false,
        },
      });
    }
  }
}
class IClientErrorValid {
  documentNumber: string;
  errorResponse: ErrorResponse
  constructor(documentNumber: string, errorResponse: ErrorResponse) {
    this.documentNumber =documentNumber;
    this.errorResponse = errorResponse;
  }


  public getDocumentNumber() {
    return this.documentNumber;
  }

  public getErrorResponse() {
    return this.errorResponse;
  }
}