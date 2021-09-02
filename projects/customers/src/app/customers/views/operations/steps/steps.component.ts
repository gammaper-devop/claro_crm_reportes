import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EInputValidation } from '@claro/commons';
import { EventBus } from '@claro/commons/event-bus';
import { MessageBus } from '@claro/commons/message-bus';
import { MemoryStorage, LocalStorage, SessionStorage } from '@claro/commons/storage';
import {
  ConfirmService,
  SnackbarService,
  ErrorCodes,
  ECustomerDocument,
  Messages,
  ErrorResponse,
  CRMGenericsService,
  Office,
  BiometricBody,
} from '@claro/crm/commons';
import { User, EChannel, AuthService } from '@shell/app/core';
import {
  Customer,
  Line,
  EFlowType,
  LineAdditional,
  EOperationType,
  Delivery,
  PaymentPending,
} from '@customers/app/core';
import { TradeAgreementsComponent } from '@customers/app/customers/views/operations/steps/trade-agreements/trade-agreements.component';
import { EStepFlowName, EStepNav } from './steps.enum';
import { IStepDetail } from './step-detail.interface';
import { StepsPresenter } from './steps.presenter';
import { MatDialog } from '@angular/material/dialog';
import { MaxlinesComponent } from './maxlines/maxlines.component';
import { UTILS } from '@claro/commons';
import { IParameter } from '@contracts/app/core';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
  providers: [StepsPresenter],
})
export class StepsComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() customer: Customer;
  @Output() summaryEmitter = new EventEmitter<any>();
  @Input() error: ErrorResponse;
  @Input() omissionBiometric: boolean;
  @Output() sendExitPermission = new EventEmitter<any>();

  temporal: boolean = false;
  step: IStepDetail;
  lines: Line[] = [];
  linesAdditional: LineAdditional[] = [];
  summary: boolean;
  omissionRequired: boolean;
  @ViewChild('tradeAgreementsComponent')
  tradeAgreementsComponent: TradeAgreementsComponent;

  isPortability: boolean;
  scanBiometric: boolean;
  autoFirePortability: boolean;
  isLoading: boolean;
  startSaveSale: boolean;
  withBiometric: boolean;
  biometricAttemptsNumber: number;
  saleAttemptsNumber: number;
  viewLogin: boolean;
  viewMultipoints: boolean;
  inputType: EInputValidation;
  showNextBtn: boolean;
  multipointsSelects: any;
  isCAC: boolean;
  showReasons: boolean;
  pointsValue: any;
  isOptionPack: boolean;
  echannelCAC: EChannel;
  hideLoyalty: boolean;
  vhiddenFide: boolean;
  totalLines: number;
  maxLines: any;
  flagMultipoint: boolean;
  deliveryRequest: Delivery;
  showDocumentsSign: boolean;
  paymentSelected: PaymentPending;
  isCAD: boolean;
  dispatchOption: IParameter;
  showDispatchOptionsCard: boolean;
  office: Office;
  flagDelivery: boolean;
  flagBio: boolean;
  flagScan: boolean;
  successfulBiometric: boolean;
  questions: any;
  virtualOfficeTypeFlag: boolean;
  flagPicking: boolean;
  flagDocumentsSign: boolean;
  showOmission: boolean;
  notShowBiometric: boolean;
  disabledSwitch: boolean;
  body: BiometricBody;
  idBioParent: any;
  wasOmitted: boolean;
  loyaltyDiscountAmount: string;
  digitalFlag: boolean;
  biometricType: string;
  flagValidateTradeAgreements: boolean;
  leftTotalPrice = new Subscription();
  flagLoyaltyDisccount: string;
  disableTGChipInside: boolean;
  flagControlModal: boolean;
  flagNoBiometricPrint: string;
  flagSelectCheckedTypeEmit: boolean;
  constructor(
    private router: Router,
    private memory: MemoryStorage,
    private eventBus: EventBus,
    private messageBus: MessageBus,
    private confirmService: ConfirmService,
    private snackbarService: SnackbarService,
    public presenter: StepsPresenter,
    private session: SessionStorage,
    private local: LocalStorage,
    private authService: AuthService,
    public dialog: MatDialog,
    public genericsService: CRMGenericsService,
  ) {
    this.user = this.authService.getUser();
    this.office = this.genericsService.getOfficeDetail();
    this.flagSelectCheckedTypeEmit = true;
    this.init();
    this.showNextBtn = false;
    this.showReasons = false;
    this.echannelCAC = EChannel.CAC;
    this.hideLoyalty = false;
    this.showDocumentsSign = false;
    this.flagMultipoint = false;
    this.isCAC = this.user.channel === this.echannelCAC;
    this.isCAD = this.user.channel === EChannel.CAD;
    this.viewMultipoints = false;
    this.showDispatchOptionsCard = false;
    this.isOptionPack = false;
    this.flagDelivery = false;
    this.virtualOfficeTypeFlag = !!this.user.officeData.virtualOfficeType;
    this.flagPicking = this.user.picking.flagPicking === '1';
    this.flagDocumentsSign = false;
    this.showOmission = true;
    this.notShowBiometric = this.office.virtualOfficeType !== '';
    this.disabledSwitch = this.notShowBiometric;
    this.omissionRequired = true;
    this.wasOmitted = false;
    this.digitalFlag = false;
    this.biometricType = 'customers';
    this.flagLoyaltyDisccount = this.user.configurations.filter(conf => conf.key == 'flagLoyaltyDisccount')[0].value;
    this.flagNoBiometricPrint = this.user.configurations.filter(conf => conf.key == 'noBiometricPrint')[0].value;
    this.presenter.flagDisplayLoyaltyDisccount = this.flagLoyaltyDisccount == "1";
    this.flagControlModal = false;
  }

  async init() {
    this.presenter.saleSuccess = this.session.get('payment-saleSuccess');
    this.paymentSelected = null;
    this.summary = false;
    this.autoFirePortability = false;
    this.isLoading = false;
    this.startSaveSale = false;
    await this.customer;
    this.withBiometric =
      this.customer?.documentTypeCode === ECustomerDocument.DNI;
    this.biometricAttemptsNumber = 3;
    const biometricAttemptsNumberConfig = this.user?.configurations.find(
      config => config.key === 'biometricAttemptsNumber',
    );
    if (biometricAttemptsNumberConfig) {
      this.biometricAttemptsNumber = Number(
        biometricAttemptsNumberConfig.value,
      );
    }
    this.saleAttemptsNumber = 3;
    const saleAttemptsNumberConfig = this.user?.configurations.find(
      config => config.key === 'saleAttemptsNumber',
    );
    if (saleAttemptsNumberConfig) {
      this.saleAttemptsNumber = Number(saleAttemptsNumberConfig.value);
    }
    this.viewMultipoints = null;
    this.viewLogin = null;
  }

  async ngOnInit() {
    this.initStep();
    this.checkPaymentProfile();
    if (this.isCAC) {
      this.flagMultipoint = await this.presenter.validateMultipoints({
        consultType: '1',
        officeCode: this.office.officeCode,
        channelCode: '',
        profileCode: this.user.chainProfile,
      });
      if (this.user.picking.flagDelivery === '1') {
        this.flagDelivery = true;
      }
    }
    this.onViewLogin();
    this.onViewMultipoints();
    this.flagValidateTradeAgreements = false;
  }

  viewLoginValue(value) {
    this.viewLogin = value;
  }

  viewUserValue(value) {
    this.user = value;
  }

  viewMultipointsValue(value) {
    this.viewMultipoints = value;
  }

  viewChannelValue(value: string) {
    this.user.channel = value;
    this.isCAC = this.user.channel === EChannel.CAC;
    this.onViewLogin();
    this.isCAD = this.user.channel === EChannel.CAD;
  }

  multipointsValue(value) {
    this.multipointsSelects = value;
    this.scanBiometric = false;
  }

  onViewLogin() {
    const configLogin = Number(
      this.user.configurations.find(config => config.key === 'operationsLogin')
        ?.value || 1,
    );
    this.viewLogin = this.user.channel === EChannel.CAD && configLogin === 1;
  }

  async onViewMultipoints() {
    if (this.memory.get('oldChannel')) {
      this.user.channel = this.memory.get('oldChannel');
    }
    this.isCAC = this.user.channel === EChannel.CAC;
    this.isPortability =
      this.presenter.saleOperationType === EOperationType.POR;
    if (this.isPortability) {
      this.viewMultipoints = false;
    } else {
      this.viewMultipoints = this.isCAC && this.flagMultipoint;
    }
  }

  ngOnDestroy(): void {
    this.session.remove('payment-select');
    this.session.remove('payment-saleSuccess');
  }

  setLines(lines: Line[]) {
    this.lines = lines;
    this.sendExitPermission.emit(false);
  }

  async setOperationType(operationType: string) {
    this.dispatchOption = null;
    this.presenter.setOperationType(operationType);
    setTimeout(() => {
      this.onViewLogin();
      this.onViewMultipoints();
    });
    this.scanBiometric = false;
    this.isOptionPack = null;
  }

  async getBiometricConfig(value: string) {
    this.dispatchOption = null;
    if (this.withBiometric) {
      try {
        let productType = '';
        const processCode = this.paymentSelected ? 'PAG01' : 'VEN01';
        if (!this.paymentSelected) {
          if (this.isPortability) {
            productType = this.lines[0].service.value;
          } else if (this.presenter.isRenoRepo) {
            productType = this.lines[0].productType.value;
          } else {
            productType = value;
          }
        } else {
          productType = value;
        }
        const response = await this.presenter.getBiometricConfig(
          this.user.office,
          productType,
          processCode,
        );
        this.scanBiometric = response;
        this.body = {
          person: this.customer,
          errorSale: this.presenter.errorSale,
          scanBiometric: this.scanBiometric,
          flagBio: this.flagBio,
          saleSuccess: this.presenter.saleSuccess,
          user: this.user,
          secNumber: this.presenter.secNumber,
          saleOperationType: this.presenter.saleOperationType,
          limitBiometricAttempts: this.biometricAttemptsNumber,
          lines: this.lines,
          omissionRequired: this.omissionRequired,
          orderNumber: this.paymentSelected?.orderNumber || ''
        };
      } catch (error) {
        this.scanBiometric = false;
      }
    } else {
      this.scanBiometric = false;
    }
  }

  async checkPaymentProfile() {
    this.isLoading = true;
    const selPayment = this.session.get('payment-select');
    this.paymentSelected = selPayment;
    if (selPayment) {
      const response = await this.presenter.getSummaryPaymentPending({
        orderNumber: selPayment.orderNumber,
        orderType: selPayment.typeDocument,
      });

      if (response) {
        this.isPortability =
          selPayment.operationType.value === EOperationType.POR;
        await this.setOperationType(selPayment.operationType.value);
        this.linesAdditional = this.presenter.getLinesAdditional();
        await this.getBiometricConfig(this.linesAdditional[0].productType);
        let passBiometric = { value: '0' };
        if (this.withBiometric) {
          passBiometric = await this.presenter.passBiometric(
            selPayment.orderNumber,
            selPayment.secNumber,
            this.linesAdditional[0].productType,
          );
        }
        this.flagBio = passBiometric?.value === '1' && this.scanBiometric;
        if (this.withBiometric) {
          this.body.flagBio = this.flagBio;
        }

        let indexStep = 8;
        if (this.isPortability) {
          indexStep = 7;
          this.presenter.setSecNumber(selPayment.secNumber);
        }

        this.leftTotalPrice = this.messageBus.on$("leftTotalPriceChannel", "leftTotalPriceTopic").subscribe(
          totalPrice => {
            this.presenter.totalPrice = totalPrice;
          }
        );

        this.presenter.setEmail(this.presenter.summaryPaymentPending.email);
        this.presenter.flowType = EFlowType.EXIST_FLOW;
        this.presenter.orderNumber = selPayment.orderNumber;
        this.presenter.orderNumberSynergi = selPayment.documentSynergy || '';

        if (!this.presenter.totalPrice) {
          this.presenter.totalPrice = Object.values(this.linesAdditional)
            .reduce((t, { salesPrice }) => t + Number(salesPrice), 0)
            .toFixed(2);
        }
        if (!this.flagBio) {
          this.presenter.saleSuccess = true;
        }
        this.messageBus.emit(
          'leftLinesChannel',
          'orderNumber',
          this.presenter.orderNumber,
        );

        this.setStep({
          index: indexStep,
          flowName: EStepFlowName.all,
        });

        this.checkFlagSP();
      } else {
        this.snackbarService.show(ErrorCodes['CRM-922'], 'error');
        this.router.navigate(['/clientes/perfil']);
      }
      this.isLoading = false;
    } else {
      this.isLoading = false;
    }
  }

  scanFingers() {
    this.flagScan = true;
    if (!this.scanBiometric) {
      this.saveSale();
    }
  }

  questionsAnswer(questions) {
    this.questions = questions;
    if (this.questions) {
      this.openDataNoBioPrint(this.questions);
      this.flagControlModal = true;
    }
  }

  initStep() {
    this.step = { index: 1, flowName: EStepFlowName.all };
  }

  leaveReceived() {
    const step: IStepDetail = { index: 1 };
    !this.flagBio ? this.setStep(step) : window.history.back();
  }

  setStep(step: IStepDetail) {
    this.flagValidateTradeAgreements = true;
    this.step.index = step.index;
    if (step.flowName) {
      this.step.flowName = step.flowName;
      this.lines = [];
      this.messageBus.emit('leftLinesChannel', 'leftLinesTopic', []);
      this.messageBus.emit('leftLinesChannel', 'orderNumber', '');
      this.eventBus.$emit('getFlowName', step.flowName);
    }
  }

  setPoints(points: any) {
    this.pointsValue = points;
  }

  sendSaleOptionSteps(event: boolean) {
    this.isOptionPack = event;
  }

  navStep(direction: EStepNav) {
    direction === EStepNav.next ? this.nextStep() : this.prevStep();
  }

  getTotalLines(total: any) {
    this.maxLines = total;
  }

  async openDialog(value: any) {
    await this.dialog.open(MaxlinesComponent, {
      data: value,
    });
  }

  catchDocumentSign(value: any){
    if (value == false){
      this.temporal = true
    } else {
      this.temporal = false;
    }
  }

  async nextStep(summary = false) {

    if (this.multipointsSelects) {
      if (
        (this.echannelCAC === this.multipointsSelects.selectChannel.value) 
        //&&(this.user.office === this.multipointsSelects.selectPointSale.value)
      ) {
        // this.flagDocumentsSign = true;
        if (this.customer.documentTypeCode !== ECustomerDocument.DNI || this.customer.documentTypeCode === ECustomerDocument.DNI) {
          this.flagDocumentsSign = true;
        }
      } else {
        this.flagDocumentsSign = false;
      }
    } else {
      if (this.isCAC) {
        if (this.customer.documentTypeCode !== ECustomerDocument.DNI) {
          this.flagDocumentsSign = true;
        } else {
          this.flagDocumentsSign = false;
        }
      }
    }

    if (!this.isPortability) {
      if ((this.flagMultipoint) && (this.showDispatchOptionsCard)) {
        if (this.dispatchOption === null) {
          this.snackbarService.show(
            'Se debe seleccionar un tipo de entrega.',
            'error',
          );
          return false;
        }
      }
    }
    if (summary) {
      this.summary = true;
      this.summaryEmitter.emit(this.summary);
      if(this.dispatchOption !== null) {
        this.flagSelectCheckedTypeEmit = this.dispatchOption.value === "1";
        if (this.multipointsSelects) {
          this.flagSelectCheckedTypeEmit = true;
        }
      }
      if (this.pointsValue) {
        this.lines[0].claroPoints = this.pointsValue;
      }
      let enterToFlagDocumentsSign;
      if (
        this.presenter.isNewLine &&
        this.lines[0].productType?.value === '99'
      ) {
        console.log(this.flagPicking);
        this.flagPicking = false;
        this.flagDocumentsSign = this.withBiometric;
        enterToFlagDocumentsSign = this.withBiometric;
      }
      if (this.flagPicking) {
        this.flagDocumentsSign = this.withBiometric;
        enterToFlagDocumentsSign = this.withBiometric;
      }
      if (
        enterToFlagDocumentsSign === false ||
        (!this.flagDelivery &&
          !this.flagPicking &&
          (this.multipointsSelects || (this.isCAC && !this.scanBiometric)))
      ) {
        this.step.index++;
        this.memory.set('is-valid-email', true);
      }
    }

    this.step.index++;
    this.totalLines = this.lines.length;
    if (
      this.maxLines &&
      this.maxLines.warningMessage &&
      this.maxLines.quantityLineasAccumulated + this.totalLines >
      this.maxLines.quantityLinesMaximum
    ) {
      if (this.flagControlModal) {
        this.openDialog(this.maxLines.warningMessage);
        this.flagControlModal = false
      }
      //this.openDialog(this.maxLines.warningMessage);
    }
  }

  prevStep() {
    if (this.step.index !== 2) {
      this.step.index--;
    }
  }

  stepCheck(indexMin: number, indexMax: number, flowName: string) {
    const indexValid =
      this.step.index >= indexMin && this.step.index <= indexMax;
    const flowNameValid =
      this.step.flowName === flowName || flowName === EStepFlowName.all;
    return indexValid && flowNameValid;
  }

  expandedCheck(index: number) {
    return this.step.index <= index;
  }

  biometricScanEmit(data: {
    success: boolean;
    omitted: boolean;
    idBioParent: string;
    passedFingersScan: boolean;
  }) {
    this.digitalFlag = data.passedFingersScan;
    this.idBioParent = data.idBioParent;
    this.wasOmitted = data.omitted;
    this.saveSale();
    this.successfulBiometric = data.success;

    if (data.success) {
      this.flagControlModal = true;
    } 

    if (this.presenter.saleSuccess) {
      if (data.success) {
        setTimeout(() => {
          this.presenter.saleSuccess = true;
        }, 3000);
      }
      if (data.omitted) {
        this.wasOmitted = true;
      }
    }
  }

  openDataNoBioPrint(questions: any[]) {
    let isRenoRepo = false;
    const services: string[] = [];

    if (
      this.presenter.saleOperationType === EOperationType.POR ||
      this.presenter.saleOperationType === EOperationType.ALT
    ) {
      isRenoRepo = false;
    } else {
      isRenoRepo = true;
    }

    if (this.lines.length > 0) {
      if (isRenoRepo) {
        services.push(this.lines[0].phone);
      } else {
        this.lines.forEach((line: any) => {
          services.push(line.iccid.serie);
        });
      }
    } else if (this.linesAdditional.length > 0) {
      if (isRenoRepo) {
        services.push(this.linesAdditional[0].line);
      } else {
        this.linesAdditional.forEach((aditional: any) => {
          services.push(aditional.iccid);
        });
      }
    }

    if (this.flagNoBiometricPrint === '1') {
      const dataNoBioPrint = {
        fullName: this.customer.fullName,
        documentNumber: this.customer.documentNumber,
        noBiometricQuestion: questions,
        isRenoRepo,
        services,
      };

      this.local.set('no-biometric-print', dataNoBioPrint);
      const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
      a.href = '/clientes/nobiometria-impresion';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.log("dataNoBioPrint omitted");
    }
  }

  async saveSale() {
    if (this.flagBio) {
      return;
    }
    if (!this.memory.get('is-valid-email') && !this.memory.get('is-pass-email')) {
      this.snackbarService.show('mustEnterEmail', 'warning');
      return;
    }
    this.startSaveSale = true;
    const saleSuccess = await this.presenter.saveSales(
      this.digitalFlag,
      this.customer,
      this.user,
      this.lines,
      this.scanBiometric,
      this.multipointsSelects,
      this.deliveryRequest,
      this.dispatchOption,
      this.idBioParent,
      this.flagPicking,
    );
    if (saleSuccess) {
      if (this.multipointsSelects) {
        this.flagSelectCheckedTypeEmit = true;
      }
      if (
        this.lines[0].claroPoints &&
        this.lines[0].claroPoints.pointsChanged !== null &&
        this.lines[0].claroPoints.pointsChanged > 0
      ) {
        const date: Date = new Date();
        const dataPrint = {
          officeAttention: this.presenter.office.officeDescription,
          customer: this.customer.fullName,
          legalRepresentative: '',
          documentType: this.customer.documentTypeDescription,
          documentNumber: this.customer.documentNumber,
          date: UTILS.formatDate(date),
          interaction: this.presenter.summaryPaymentPending.idOrderMSSAP,
          lineNmber: this.lines[0].phone,
          description: 'Descuentos Por Reposición',
          points: this.lines[0].claroPoints.pointsChanged,
          quantity: '1',
          discount: this.lines[0].claroPoints.moneyReceived,
          pointsRedeemed: '1',
        };
        this.local.set('claroclub-print', dataPrint);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        a.href = 'clientes/claroclub-impresion';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      this.messageBus.emit(
        'leftLinesChannel',
        'orderNumber',
        this.presenter.orderNumber,
      );
      this.navStep(EStepNav.next);
      if (
        this.presenter.isNewLine ||
        this.presenter.isRenoRepo ||
        this.wasOmitted
      ) {
        this.step.index++;
      }
    } else {
      this.presenter.saleSuccess = false;
      this.presenter.showSaleError();
      this.eventBus.$emit('scrollTo');
    }
  }

  resolvePortabilityValidation(isValid: boolean) {
    if (isValid) {
      this.navStep(EStepNav.next);
    }
    this.presenter.portabilityIsValid = isValid;
    this.eventBus.$emit('scrollTo');
  }

  cancelPayment() {
    this.confirmService.open('deleteLinePortability').subscribe(response => {
      if (response) {
        let message = Messages.cancelPaymentError.replace(
          'XXX',
          this.presenter.orderNumber,
        );
        this.presenter
          .postCancelPayment(
            this.user,
            this.presenter.secNumber,
            this.presenter.orderNumber,
            this.presenter.orderNumberSynergi,
          )
          .then((resp: boolean) => {
            if (resp) {
              message = Messages.cancelPaymentSuccess.replace(
                'XXX',
                this.presenter.orderNumber,
              );
              this.sendExitPermission.emit(true);
              this.snackbarService.show(message, 'success');
              this.memory.remove('payments');
              this.router.navigate(['/clientes/perfil']);
            } else if (resp === false) {
              this.snackbarService.show(message, 'error');
            }
          })
          .catch(() => {
            this.snackbarService.show(message, 'error');
          });
      }
    });
  }

  savePDF() {
    this.presenter.postGenerateDocuments(
      this.digitalFlag,
      this.customer,
      this.user,
      this.paymentSelected?.date,
      true,
    );
  }

  checkFlagSP() {
    if (
      this.isPortability &&
      this.presenter.summaryPaymentPending &&
      this.presenter.summaryPaymentPending.flagSP
    ) {
      this.autoFirePortability = true;
    }
  }

  async finishSaleCac() {
    this.sendExitPermission.emit(true);
    let phones: string[];
    if (this.lines) {
      phones = this.lines.map(line => line.phone);
    } else {
      phones = this.linesAdditional
        .filter(line => line.type === 'Equipo' || line.itemType === 'Chip')
        .map(line => line.line || '');
    }

    const lineOptionValue =
      (this.lines && this.lines[0].option.value) ||
      (this.linesAdditional &&
        ((this.linesAdditional[0].type === 'Pack' && 'P') || 'E'));
    this.memory.set('successData', {
      name: this.customer.name,
      email:
        this.presenter.signatureType === 'digital-signature'
          ? this.presenter.email
          : '',
      phones: phones,
      saleOperationType: this.presenter.saleOperationType,
      lineOptionValue,
      wasOmitted: this.wasOmitted,
    });
    this.router.navigate(['/clientes/venta-exitosa']);
  }

  nextBtn(value: boolean) {
    console.log("nextBtn()")
    console.log("this.showNextBtn: " + this.showNextBtn)
    console.log("this.showReasons: " + this.showReasons)
    console.log("this.step.index: " + this.step.index)
    this.showNextBtn = value;
    if (!this.showNextBtn && this.showReasons) {
      this.hideNextBtn();
      this.hideReasonsCard();
    } else if (
      (!this.showNextBtn && this.step.index === 3) ||
      this.showNextBtn
    ) {
      this.hideNextBtn();
    } else {
      this.showNextBtn = true;
    }
  }

  hideNextBtn() {
    console.log("hideNextBtn(): ")
    this.showNextBtn = false;
  }

  showReasonsCard() {
    this.showReasons = true;
  }

  hideReasonsCard() {
    this.showReasons = false;
  }

  hideLoyaltyCard(value: boolean) {
    this.hideLoyalty = value;
  }
  hiddenFide(value: boolean) {
    this.vhiddenFide = value;
  }

  changeDisplayLoyalty(value: boolean) {
    this.presenter.flagDisplayLoyaltyDisccount = value;
  }

  disableTGChipsEmitter(value: boolean) {
    this.disableTGChipInside = value;
  }
  sendDeliveryRequest(event: Delivery) {
    const deliveryExists = !!this.deliveryRequest;
    this.deliveryRequest = event;
    this.showDocumentsSign = true;
    if (!this.scanBiometric && !deliveryExists) {
      this.nextStep();
      this.memory.set('is-valid-email', true);
    }
  }

  dispatchOptionsSelected(event: IParameter) {
    this.dispatchOption = event;
    this.dispatchOption = event; 
  }

  dispatchOptionsCard(event: boolean) {
    this.showDispatchOptionsCard = event;
  }

  receiveLoyaltyDiscountAmount(loyaltyDiscountAmount: string) {
    this.loyaltyDiscountAmount = loyaltyDiscountAmount;
  }
}
