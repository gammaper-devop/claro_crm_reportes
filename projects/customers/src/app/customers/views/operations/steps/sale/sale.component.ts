import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { MessageBus } from '@claro/commons/message-bus';
import {
  ConfirmService,
  SnackbarService,
  BiometricConfig,
  ErrorResponse,
  CRMErrorService,
} from '@claro/crm/commons';
import { User, EChannel } from '@shell/app/core';
import {
  Campaign,
  Customer,
  Department,
  ESaleOption,
  IParameter,
  Line,
  PopulatedCenter,
  Price,
  Ubigeo,
  Maxlines,
  ISerie,
  EOperationType,
  Plan,
} from '@customers/app/core';
import { SalePresenter } from './sale.presenter';
import { Material } from '@customers/app/core/models/materials.model';
import { StepsPresenter } from '../steps.presenter';


@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss', './collapse.component.scss'],
  providers: [SalePresenter, StepsPresenter],
})
export class SaleComponent implements OnInit, OnChanges, OnDestroy {
  @Input() user: User;
  @Input() customer: Customer;
  @Input() error: ErrorResponse;
  @Input() withBiometric: boolean;
  @Input() biometricConfig: BiometricConfig;
  @Input() saleOperationType: string;
  @Input() isNewLine: boolean;
  @Input() isRenoRepo: boolean;
  @Input() lines: Line[];
  @Input() secNumber: string;
  @Input() flagPicking: boolean;
  @Input() multipointsSelects: any;
  @Output() sendLines = new EventEmitter();
  @Output() sendSaleOption = new EventEmitter<boolean>();
  @Output() maxLinesService = new EventEmitter();
  @Output() dispatchOptionsCard = new EventEmitter<boolean>();
  @Output() getBiometricConfig = new EventEmitter();
  @Output() changeDisplayLoyalty = new EventEmitter<boolean>();
  @Output() disableTGChipsEmitter = new EventEmitter<boolean>();
  series: any[];
  linesForm: FormArray;
  showICCID: boolean;
  showIMEI: boolean[];
  index: number;
  collapse = false;
  oldValues: any[];
  linesConfig: Maxlines;
  countLineIccid: any;
  isValidForm: boolean[];
  editLeftLineRef = new Subscription();
  maxlinesError = null;
  isCAD: boolean;
  lineName: string;
  isRenoRepoOption: string;
  isCAC: boolean;
  defaultDepartment: Department;
  autoSelect: boolean[];
  isChip: ESaleOption;
  saleFlagPicking = false;
  productTypeDisabled: boolean;
  flagLoyaltyDisccount: string;
  isEnabledDipatchCard: boolean;
  isAvailable: boolean;
  isUpdatePlans: boolean;
  saleOperationTypeAlternative: string;
  cleanEventEmit: boolean;
  constructor(
    private fb: FormBuilder,
    public presenter: SalePresenter,
    public presenterSteps: StepsPresenter,
    private confirmService: ConfirmService,
    private snackbarService: SnackbarService,
    private messageBus: MessageBus,
    private errorService: CRMErrorService,
  ) {
    this.index = -1;
    this.linesForm = this.fb.array([]);
    this.oldValues = [];
    this.series = [];
    this.showICCID = true;
    this.showIMEI = [];
    this.autoSelect = [];
    this.isValidForm = [];
    this.isChip = ESaleOption.Chip;
    this.productTypeDisabled = false;
    this.isAvailable= false;
    this.cleanEventEmit = false;
  }

  async ngOnInit() {
    if (this.isRenoRepo) {
      this.isRenoRepoOption = this.lines[0].typeOperation.value;
      if(this.user.channel === '01'){
        if(this.multipointsSelects !== undefined){
          if(this.multipointsSelects.selectChannel.label === 'CAC'){
            this.isDispatchCard(true);
          }else{
            this.isDispatchCard(false);
          }
        }else{
          this.isDispatchCard(false);
        }
      }else{
        this.isDispatchCard(false);
      }
    }
    this.lineName = 'Linea';
    const isReno = EOperationType.REN === this.saleOperationType;
    const isRepo = EOperationType.REP === this.saleOperationType;
    this.isCAD = this.user.channel === EChannel.CAD;
    this.isCAC = this.user.channel === EChannel.CAC;
    if (isRepo || isReno) {
      this.lineName = isReno
        ? this.isRenoRepoOption === ESaleOption.Phone
          ? 'Equipo'
          : 'Pack'
        : 'Chip';
    }

    if (this.isNewLine) {
      if(this.user.channel === '01'){
        if(this.multipointsSelects !== undefined){
          if(this.multipointsSelects.selectChannel.label === 'CAC'){
            this.isDispatchCard(true);
          }else{
            this.isDispatchCard(false);
          }  
        }else{
          this.isDispatchCard(false);
        }
      }else{
        this.isDispatchCard(false);
      }
      this.lines = [];
      await this.getMaxlines();
      if (this.isLimitLines()) {
        if (!this.maxlinesError) {
          this.presenter.error = this.errorService.showFunctionalError(
            'CRM-941',
          );
        }
        return;
      }
      this.addLine();
      this.getDepartments();
      this.presenter.getProductsTypes(this.user.channel);
      this.presenter.getModalities();
    } else {
      if (!this.isRenoRepo) { 
        this.getDepartments();
        await this.getMaxlines();
        this.presenter.getOptions(this.lines, this.secNumber);
        this.presenter.getModalities();
        this.isDispatchCard(false);
      } else {
        this.index++;
      }
      this.setLines();
      this.getBiometricConfig.emit();
    }
    this.checkEditLeftLines();
    this.renoRepoValidateOptions();
    if (this.isCAC) {
      if (this.isRenoRepo) {
        this.presenter.getMaterials(
          this.isRenoRepoOption,
          this.saleOperationType,
          this.lines[0],
          true,
        );
      } if(!this.isNewLine && !this.isRenoRepo) {
        await this.presenter.getSeries('iccid', this.user,null,null,true);
      }
    }
  }

  ngOnChanges() {
    if (this.error) {
      this.presenter.error = this.error;
      return;
    }
  }

  ngOnDestroy() {
    this.editLeftLineRef.unsubscribe();
    this.isDispatchCard(false);
  }

  async getDepartments() {
    await this.presenter.getDepartments();
    if (this.presenter.departments.length) {
      this.defaultDepartment = this.presenter.departments.find(
        department => department.value === this.presenter.office.departmentCode,
      );
      if (this.isNewLine && this.defaultDepartment) {
        this.changeDepartment(0, this.lines[0], this.defaultDepartment);
      }
    }
  }

  renoRepoValidateOptions() {
    
    if (this.isRenoRepo) {
      this.lines[0].option = {
        label: this.lines[0].typeOperation.label,
        value: this.isRenoRepoOption,
      };
      if (this.isRenoRepoOption === ESaleOption.Pack) {
        this.showIMEI[0] = true;
      } else if (this.isRenoRepoOption === ESaleOption.Phone) {
        this.showIMEI[0] = true;
        this.showICCID = false;
      } else {
        this.showIMEI[0] = false;
      }
    }
  }

  async getMaxlines() {
    const response = await this.presenter.getMaxlines(
      this.user,
      this.customer,
      this.saleOperationType,
    );
    if (response) {
      this.maxLinesService.emit(response);
      this.linesConfig = response;
    } else {
      this.maxlinesError = this.presenter.error;
    }
  }

  async again() {
    if (this.withBiometric && !this.biometricConfig) {
      if (this.isNewLine) {
        this.getBiometricConfig.emit(this.lines[0]?.productType?.value);
      } else {
        this.getBiometricConfig.emit();
      }
    }
    this.presenter.error = null;
    this.clearErrors(this.index);
    this.presenter.showSerieInfo[this.index] = '-';
    if (this.isNewLine) {
      if (!this.linesConfig) {
        await this.getMaxlines();
        if (this.isLimitLines()) {
          if (!this.maxlinesError) {
            this.presenter.error = this.errorService.showFunctionalError(
              'CRM-941',
            );
          }
          return;
        }
        this.addLine();
      }
      this.presenter.getProductsTypes(this.user.channel);
    } else {
      this.presenter.getModalities();
    }
    this.presenter.getOptions(this.lines, this.secNumber);
    this.presenter.getDepartments();
  }

  setLines() {
    this.lines.forEach((line, i) => {
      this.linesForm.push(this.createLineForm());
      this.emptyData(i);
      if (this.defaultDepartment) {
        this.changeDepartment(i, this.lines[i], this.defaultDepartment);
      }
    });
  }

  addLine() {
    this.cleanEventEmit = false;
    if(this.lines.length < 1){
      this.index++;
      this.lines.push(new Line({ order: this.index + 1, phone: '0' } as Line));
      this.linesForm.push(this.createNewLineForm());
      this.emptyData(this.index);
    } else {
      
      if(this.lines[0] !== null && this.presenter.newLineOptions[0].length < 2 ) {
        let myMap = new Map([
          ["C", "Ya ha superado la cantidad máxima de Chips."],
          ["P", "Ya ha superado la cantidad máxima de Packs."]
        ]); 
      
        this.snackbarService.show(
          myMap.get(this.lines[0].option.value),
          'error',
        );
        return;
      }else{
        this.index++;
      this.lines.push(new Line({ order: this.index + 1, phone: '0' } as Line));
      this.linesForm.push(this.createNewLineForm());
      this.emptyData(this.index);
      }
    }    

    if (this.defaultDepartment) {
      this.changeDepartment(
        this.index,
        this.lines[this.index],
        this.defaultDepartment,
      );
    }
    if (this.lines[0].productType) {
      this.lines[this.index].productType = this.lines[0].productType;
      this.presenter.getNewLineOptions(this.index, this.lines[0].productType, this.user);
      this.productTypeDisabled = true;
    }
  }

  isLimitLine(): boolean {
    return this.isLimitLines();
  }

  private isLimitLines() {    
    return (
      !this.linesConfig ||
      (this.linesConfig &&
        this.lines.length === this.linesConfig.quantityLinesAllowed)
    );
  }

  emptyData(i: number) {
    this.clearErrors(i);
    if (this.isRenoRepoOption === ESaleOption.Phone) {
      this.lines[i].iccid = { serie: '' } as ISerie;
    } else {
      this.lines[i].iccid = { serie: '895110' } as ISerie;
    }
    this.autoSelect[i] = true;
    if (this.cleanEventEmit) {
      if(i == 0){
        if (this.lines.length <2) {
          this.presenter.newLineOptions[i] = []
        }
      }
    } else {
      this.presenter.newLineOptions[i] = []
    }
    //this.presenter.newLineOptions[i] = [];
    this.presenter.campaigns[i] = [];
    this.presenter.prices[i] = [];
    this.presenter.plans[i] = [];
    this.presenter.ubigeos[i] = [];
    this.presenter.populatedCenters[i] = [];
  }

  clearErrors(i: number) {
    this.isValidForm[i] = false;

    if (!this.isRenoRepo) {
      this.showIMEI[i] = false;
    }

    if (this.lines[i].option?.value === ESaleOption.Pack) {
      this.showIMEI[i] = true;
    }

    this.oldValues[i] = {
      iccid: '',
      imei: '',
    };
    this.presenter.showSerieInfo[i] = '';
    this.presenter.errorSerie[i] = {
      iccid: '',
      imei: '',
    };
  }

  createLineForm() {
    return this.fb.group({
      modality: [null, [Validators.required]],
      option: [null, Validators.required],
      iccidDescription: [null, Validators.required],
      iccid: [null, [Validators.required, Validators.pattern('[0-9]{18}')]],
      imei: [null, [Validators.required, Validators.pattern('[0-9]{15,18}')]],
      imeiDescription: [null, Validators.required],
      campaign: [null, Validators.required],
      price: [null, Validators.required],
      plan: [null, Validators.required],
      department: [null, Validators.required],
      ubigeo: [null, Validators.required],
      populatedCenter: [null, Validators.required],
      acceptCoverage: [false, Validators.requiredTrue],
    });
  }

  createNewLineForm() {
    const lineForm = this.createLineForm();
    lineForm.removeControl('modality');
    lineForm.addControl(
      'productType',
      new FormControl('', [Validators.required]),
    );
    lineForm.updateValueAndValidity();
    return lineForm;
  }

  expandItem(index: number) {
    this.lines[index].expanded = true;
  }

  minimizedItem(index: number) {
    this.lines[index].expanded = false;
  }

  get phones(): string[] {
    return this.lines.map(line => line.phone);
  }

  changeModality(line: Line, modality: IParameter) {
    line.modalityTo = modality;
  }

  changeProductType(
    i: number,
    line: Line,
    lineForm: FormGroup,
    productType: IParameter,
  ) {
    //aqui
    localStorage.setItem('productTypeId',  productType.value);
    line.productType = productType;
    if (this.isNewLine) {

      this.autoSelect[i] = true;
     
      if (this.saleFlagPicking && productType.value === '01') {
        this.flagPicking = true;
        this.saleFlagPicking = false;
      }
      if (this.flagPicking && productType.value === '99') {
               this.flagPicking = false;
               this.saleFlagPicking = true;
      }

      if (!this.flagPicking) {
        line.iccid = { serie: '895110' } as ISerie;
      }
      line.option = null;
      line.imei = null;
      this.clearErrors(i);
      this.presenter.newLineOptions[i] = [];
      this.changeOption(i, line, lineForm, null);
      this.presenter.getNewLineOptions(i, productType, this.user);
      this.isProductAllowedToDispatch(productType.value);
      if (this.withBiometric && !this.biometricConfig) {
        this.getBiometricConfig.emit(productType.value);
      }
      if(this.user.channel === EChannel.CAC) {
        this.presenter.getSeries('iccid', this.user, line);
      }
      
      
    }
  }

  isDispatchCard(valueCard : boolean){
    this.dispatchOptionsCard.emit(valueCard);
    this.isEnabledDipatchCard = valueCard;
  }

  isProductAllowedToDispatch(value: string) {
    const valuesAllowed = this.user.configurations.find(
      element => element.key === 'allowedProductsToDispatch',
    )?.value;
    const valuesAllowedSplit = valuesAllowed?.split('|');
    const coincidence = valuesAllowedSplit?.some(element => element === value);
  }

  async changeMaterials(
    i: number,
    type: 'iccid' | 'imei',
    line: Line,
    lineForm: FormGroup,
    value: string,
  ) {
    
    
    let material: Material;
    if (type === 'iccid') {
      
      material = this.presenter.materialICCID.find(
        materialICCID => materialICCID.code === value,
      );
      
      line[type] = material;
      
    } else {
      
      material = this.presenter.materialIMEI.find(
        materialIMEI => materialIMEI.code === value,
      );
      
      material.serie="";
      line[type] = material;
      
    }
    this.presenter.showSerieInfo[i] = type;
    this.presenter.errorSerie[i][type] = null;
   
    line.price = null;
    this.presenter.prices[i] = [];
    this.linesForm.controls[i].get('price').setValue(null);
    
    lineForm.controls.campaign.setValue(null);
    lineForm.controls.price.setValue(null);
    lineForm.controls.plan.setValue(null);
    
    if (!this.flagPicking) {
      
      if(!this.isNewLine && !this.isRenoRepo) await this.presenter.getSeries(type, this.user, line, material,true);
      else await this.presenter.getSeries(type, this.user, line, material,false);
      
     
    } else {
     
      if (this.isRenoRepo) {
        
        this.changeSelectSeries(
          i,
          type,
          line,
          lineForm,
          type === 'iccid' ? '100100100000000999' : '888100100000000999',
        );
      } else {
        
        this.changeSelectSeries(
          i,
          type,
          line,
          lineForm,
          type === 'iccid' ? this.user.picking.iccid : this.user.picking.imei,
        );
        
      }
    }
  }

  async changeSelectSeries(
    i: number,
    type: 'iccid' | 'imei',
    line: Line,
    lineForm: FormGroup,
    serieVal: string,
  ) {
    if (!this.flagPicking && !this.isValidSerieNumber(serieVal)) {
      lineForm.controls.imei.setValue(null);
      lineForm.updateValueAndValidity();
      return;
    }
    if (!this.isRenoRepo && type === 'iccid') {
      const material = this.presenter.serieICCID.find(
        serieICCID =>
          (!this.flagPicking && serieICCID.serie === serieVal) ||
          serieICCID.code === serieVal,
      );
      line[type] = material;
      if (this.flagPicking) {
        line[type].serie =
          type === 'iccid' ? this.user.picking.iccid : this.user.picking.imei;
      }
      this.presenter.showSerieInfo[i] = type;
      this.presenter.errorSerie[i][type] = null;
    } else {
      line[type] !== null ? line[type].serie = serieVal : "0";
    }

    if (
      this.lines[i].option &&
      (this.lines[i].option.value === ESaleOption.Phone ||
        this.lines[i].option.value === ESaleOption.Chip ||
        (this.lines[i].option.value === ESaleOption.Pack &&
          this.lines[i].iccid &&
          this.lines[i].imei))
    ) {
      let stock = null;
      if (this.flagPicking && type === 'imei') {
        stock = await this.presenter.getStockAvailability(line.imei.code);
      }
      if (!this.flagPicking || (type === 'iccid' && this.isRenoRepo) || stock) {
        this.lines[i].campaign=null;
        this.presenter.campaigns[i]=null;
        if(!this.presenter.campaigns[i]){
         this.presenter.getCampaigns(
           this.user,
           this.customer,
           this.lines[i],
           this.saleOperationType,
           this.secNumber,
           i,
         );
        }
      }
    }
  }

  isValidSerieNumber(serieNumber) {
    if (serieNumber) {
      const lineFound = this.lines.some(
        line =>
          (line.iccid && line.iccid.code && line.iccid.serie === serieNumber) ||
          (line.imei && line.imei.code && line.imei.serie === serieNumber),
      );
      if (lineFound) {
        this.snackbarService.show(
          'Ya ha utilizado este número de serie.',
          'warning',
        );
        return false;
      }
      return true;
    }
  }

  async changeOption(
    i: number,
    line: Line,
    lineForm: FormGroup,
    saleOption: IParameter,
  ) {
 
    line.option = saleOption;
    
    this.flagLoyaltyDisccount = this.user.configurations.filter(conf => conf.key =='flagLoyaltyDisccount')[0].value;

    let validFlagLoyalty: boolean = this.flagLoyaltyDisccount == "1";
    
    if(this.isNewLine || !this.isRenoRepo){
      if(line.option!==null) {
        if (line.option.value === "P") {
          this.presenterSteps.flagDisplayLoyaltyDisccount = true;
        }
        else {
          if(validFlagLoyalty) {
            this.presenterSteps.flagDisplayLoyaltyDisccount = true;
          }
          else {
            this.presenterSteps.flagDisplayLoyaltyDisccount = false;
          }
        }
      } else {
        this.presenterSteps.flagDisplayLoyaltyDisccount = validFlagLoyalty;
      }
    
      this.changeDisplayLoyalty.emit(this.presenterSteps.flagDisplayLoyaltyDisccount);
    
    
      if(this.lines.length > 1){
        for (let index = 0; index < this.lines.length; index++) {
          if(typeof this.lines[index] !== 'undefined'){
            if(this.lines[index].option.value === "P"){
              this.changeDisplayLoyalty.emit(true);
            }
          }
        }
      }
    } 
    line.campaign = null;
    line.price = null;
    line.totalPrice = '0.00';
    line.plan = null;
    this.presenter.campaigns[i] = [];
    this.presenter.prices[i] = [];
    this.presenter.plans[i] = [];
    this.presenter.selectSerieIMEI = null;
    lineForm.controls.campaign.setValue(null);
    lineForm.controls.price.setValue(null);
    lineForm.controls.plan.setValue(null);
    lineForm.updateValueAndValidity();
    this.isValidForm[i] = false;

    if (this.linesConfig) {
     
      const cantidadEncontrada = this.lines.filter(
        x => x.option && x.option.value === saleOption?.value,
      ).length;
      if (
        saleOption?.value === ESaleOption.Chip &&
        cantidadEncontrada > this.linesConfig.quantityLinesAllowedChip
      ) {
        this.resetOption(i, line, lineForm);
        this.snackbarService.show(
          'Ya ha superado la cantidad máxima de Chips.',
          'error',
        );
        return;
      } else if (
        saleOption?.value === ESaleOption.Pack &&
        cantidadEncontrada > this.linesConfig.quantityLinesAllowedPack
      ) {
        this.resetOption(i, line, lineForm);
        this.snackbarService.show(
          'Ya ha superado la cantidad máxima de Packs.',
          'error',
        );
        return;
      }
    }
    this.presenter.errorSerie[i] = {
      iccid: '',
      imei: '',
    };
    this.presenter.showSerieInfo[i] = null;

    if (this.flagPicking && !this.isRenoRepo && saleOption) {
      await this.presenter.getSeries('iccid', this.user, line);
      this.changeSelectSeries(
        i,
        'iccid',
        this.lines[i],
        this.linesForm.controls[i] as FormGroup,
        this.presenter.serieICCID[0].code,
      );
    }

    if (saleOption?.value === ESaleOption.Chip) {
      this.showIMEI[i] = false;
      line.imei = null;
      if (!this.isCAC) {
        lineForm.removeControl('imei');
      } else if (this.isRenoRepo) {
        this.presenter.getMaterials(
          ESaleOption.Chip,
          this.saleOperationType,
          line,
          false,
        );
      }
      if (line.iccid && line.iccid.code) {
        this.presenter.showSerieInfo[i] = '-';
        this.presenter.getCampaigns(
          this.user,
          this.customer,
          this.lines[i],
          this.saleOperationType,
          this.secNumber,
          i,
        );
      }
    } else if (saleOption?.value === ESaleOption.Pack) {
      this.showIMEI[i] = true;
      line.imei = null;
      if (line.iccid && line.iccid.code) {
        this.presenter.showSerieInfo[i] = '-';
      }
      if (!this.isCAC) {
        lineForm.addControl(
          'imei',
          new FormControl('', [
            Validators.required,
            Validators.pattern('[0-9]{15,18}'),
          ]),
        );
      } else {
        this.presenter.getMaterials(
          ESaleOption.Pack,
          this.saleOperationType,
          line,
          false,
        );
      }
    }

    const optionPackFound = this.lines.some(
      element => element.option?.value === ESaleOption.Pack,
    );
    this.sendSaleOption.emit(optionPackFound);
  }

  resetOption(i: number, line: Line, lineForm: FormGroup) {
    setTimeout(() => {
      lineForm.controls.option.setValue(null);
      line.option = null;
      this.autoSelect[i] = false;
      this.showIMEI[i] = false;
      lineForm.removeControl('imei');
      line.imei = null;
      lineForm.updateValueAndValidity();
    });
  }

  onChangeSerie(i: number, type: 'iccid' | 'imei', line: Line) {
    this.presenter.errorSerie[i][type] = null;
    this.oldValues[i][type] = null;
    if (this.lines[i][type] && this.lines[i][type].code) {
      this.lines[i][type].code = null;
      this.clearFieldsOnChangeSerie(i);
    }

    if (
      !this.lines[i].iccid ||
      (this.lines[i].iccid && !this.lines[i].iccid.code) ||
      !this.lines[i].imei ||
      (this.lines[i].imei && !this.lines[i].imei.code)
    ) {
      this.presenter.showSerieInfo[i] = '-';
    }
    if (
      (!this.lines[i].iccid ||
        (this.lines[i].iccid && !this.lines[i].iccid.code)) &&
      (!this.lines[i].imei || (this.lines[i].imei && !this.lines[i].imei.code))
    ) {
      this.presenter.showSerieInfo[i] = null;
    }
  }

  clearFieldsOnChangeSerie(i: number) {
    this.lines[i].campaign = null;
    this.lines[i].price = null;
    this.lines[i].totalPrice = '0.00';
    this.lines[i].plan = null;
    this.presenter.campaigns[i] = [];
    this.presenter.prices[i] = [];
    this.presenter.plans[i] = [];
    this.linesForm.controls[i].get('campaign').setValue(null);
    this.linesForm.controls[i].get('price').setValue(null);
    this.linesForm.controls[i].get('plan').setValue(null);
    this.linesForm.controls[i].updateValueAndValidity();
    this.isValidForm[i] = false;
  }

  async validateDisponibility(
    i: number,
    type: 'iccid' | 'imei',
    serieNumber: string,
  ) {
    if (
      (type === 'iccid' && (!serieNumber || serieNumber.length < 18)) ||
      (type === 'imei' && (!serieNumber || serieNumber.length < 15))
    ) {
      this.snackbarService.show('Debe ingresar una serie válida.', 'warning');
      return;
    }
    if (serieNumber) {
      if (type === 'imei' && !this.isCAD) {
        serieNumber = serieNumber.padStart(18, '0');
      }
      const lineFound = this.lines.some(
        line =>
          (line.iccid && line.iccid.code && line.iccid.serie === serieNumber) ||
          (line.imei && line.imei.code && line.imei.serie === serieNumber),
      );
      if (lineFound) {
        this.snackbarService.show(
          'Ya ha utilizado este número de serie.',
          'warning',
        );
        return;
      }
    }
    
    if (
      this.oldValues[i][type] !== this.linesForm.controls[i].get(type).value
    ) {
      
      this.oldValues[i][type] = serieNumber;
      let serie;
      if (this.isRenoRepo) {
        
        serie = await this.presenter.validateDisponibilityRepo(
          type,
          serieNumber,
          this.isNewLine ? '' : this.lines[i].phone,
          i,
          this.user,
          this.lines[i],
        );
      } else {
        serie = await this.presenter.validateDisponibility(
          type,
          serieNumber,
          this.isNewLine ? '' : this.lines[i].phone,
          this.lines[i],
          i,
        );
      }
   
      if (serie) {
        
        this.clearFieldsOnChangeSerie(i);
        this.lines[i][type] = serie;
        this.linesForm.controls[i].get(type).setValue(serie.serie);
        this.linesForm.controls[i].updateValueAndValidity();
        
        if (
          this.lines[i].option &&
          (this.lines[i].option.value === ESaleOption.Phone ||
            this.lines[i].option.value === ESaleOption.Chip ||
            (this.lines[i].option.value === ESaleOption.Pack &&
              this.lines[i].iccid &&
              this.lines[i].imei))
        ) {
          
          this.presenter.getCampaigns(
            this.user,
            this.customer,
            this.lines[i],
            this.saleOperationType,
            this.secNumber,
            i,
          );
        }
      } else {
       
        this.lines[i][type] = { serie: serieNumber } as ISerie;
      }
    }
  }

  changeCampaign(i: number, line: Line, campaign: Campaign) {
    line.campaign = campaign;
    line.price = null;
    line.totalPrice = '0.00';
    line.plan = null;
    this.presenter.prices[i] = [];
    this.presenter.plans[i] = [];
    this.linesForm.controls[i].get('price').setValue(null);
    this.linesForm.controls[i].get('plan').setValue(null);
    this.linesForm.controls[i].updateValueAndValidity();
    this.isValidForm[i] = false;
    this.presenter.getPrices(this.saleOperationType, line, i).then((value) => {
      this.isAvailable = value;
      if (this.isAvailable) {
        this.disableTGChipsEmitter.emit(true);
      }
    });
  }

  changePrice(i: number, line: Line, price: Price) {
    line.totalPrice = (
      Number(price.chipTotalPrice) + Number(price.equipmentTotalPrice)
    ).toFixed(2);
    price.chipTotalPrice = Number(price.chipTotalPrice).toFixed(2);
    price.equipmentTotalPrice = Number(price.equipmentTotalPrice).toFixed(2);
    const totalPriceValid = JSON.parse(
      JSON.stringify({data : line.totalPrice }),
    );
    this.messageBus.emit("leftLinePriceTotalChannel", "leftLinePriceTotalTopic", totalPriceValid);
    line.price = price;
    line.plan = null;
    this.presenter.plans[i] = [];
    this.linesForm.controls[i].get('plan').setValue(null);
    this.linesForm.controls[i].updateValueAndValidity();
    this.isValidForm[i] = true;
    if (this.saleOperationType === '01') {
      this.saleOperationTypeAlternative = this.obtainPlanAlternative(this.saleOperationType, line);
      this.presenter.getPlans(this.user, this.saleOperationTypeAlternative > '0' ? this.saleOperationTypeAlternative : this.saleOperationType, line, i);
    } 
    else if (this.saleOperationType === '02'){
      this.saleOperationTypeAlternative = this.obtainPlanAlternative(this.saleOperationType, line);
      this.presenter.getPlans(this.user, this.saleOperationTypeAlternative > '0' ? this.saleOperationTypeAlternative : this.saleOperationType, line, i);
    }
    else {
      this.saleOperationTypeAlternative = this.obtainPlanAlternative(this.saleOperationType, line);
      this.presenter.getPlans(this.user, this.saleOperationTypeAlternative, line, i).finally(()=>{  this.lines[i].plan=this.presenter.plan});
    }  
  }

  obtainPlanAlternative(saleOperationType:String, line: Line){
    if (saleOperationType === '03' || saleOperationType === '33') {
      if(line.service.value === '02'){
        return '04';
      }
      return '33';
    } 
    else if(saleOperationType === '04' || saleOperationType === '11'){
      if(line.service.value === '02'){
        return '04';
      }
      return '11';
    }
    else if (saleOperationType === '02' && line.productType.value === '02'){
      return '04';
    }
    else if(saleOperationType === '01' && line.service.value === '02'){
      return '04';
    }
  }

  async refreshPrices(i: number, line: Line) {
    const newPrices = await this.presenter.getRefreshPrices(
      this.saleOperationType,
      line,
      i,
    );
    if (newPrices) {
      const newPrice = newPrices.find(e => e.value === line.price.value);
      line.price.chipSku = newPrice.chipSku;
      line.price.equipmentSku = newPrice.equipmentSku;
      if (
        this.linesForm.controls[i].get('acceptCoverage').value &&
        this.isSku(line)
      ) {
        this.isValidForm[i] = true;
      } else {
        this.isValidForm[i] = false;
      }
    }
  }

  isSku(line: Line) {
    if (this.user.channel === EChannel.CAD) {
      if (
        (line.option.value === ESaleOption.Chip && line.price.chipSku !== '') ||
        (line.option.value === ESaleOption.Pack &&
          (line.price.chipSku !== '' && line.price.equipmentSku !== ''))
      ) {
        return true;
      }
      return false;
    }
    return true;
  }

  async changePlan(i: number, line: Line, plan: Plan) {
    line.plan = plan;
    if (
      (this.linesForm.controls[i].get('acceptCoverage').value &&
        this.isSku(line)) ||
      this.isRenoRepo
    ) {
      this.isValidForm[i] = true;
    }
  }

  changeDepartment(i: number, line: Line, department: Department) {
    line.department = department;
    this.linesForm.controls[i].get('populatedCenter').setValue('');
    line.ubigeo = null;
    line.populatedCenter = null;
    this.presenter.ubigeos[i] = [];
    this.presenter.populatedCenters[i] = [];
    this.presenter.getUbigeos(department.value, i);
    this.linesForm.controls[i].updateValueAndValidity();
    this.isValidForm[i] = false;
  }

  changeUbigeo(i: number, line: Line, ubigeo: Ubigeo) {
    line.ubigeo = ubigeo;
    this.linesForm.controls[i].get('populatedCenter').setValue('');
    line.populatedCenter = null;
    this.presenter.populatedCenters[i] = [];
    this.presenter.getPopulatedCenters(ubigeo.value, i);
    this.linesForm.controls[i].updateValueAndValidity();
    this.isValidForm[i] = false;
  }

  changePopulatedCenter(
    i: number,
    line: Line,
    populatedCenter: PopulatedCenter,
  ) {
    line.populatedCenter = populatedCenter;
    this.linesForm.controls[i]
      .get('populatedCenter')
      .setValue(populatedCenter.value);
    this.linesForm.controls[i].get('acceptCoverage').setValue(true);
    this.linesForm.controls[i].updateValueAndValidity();
    this.isValidForm[i] = line.plan && this.isSku(line);
  }

  changeAcceptCoverage(i: number, line: Line, event: any) {
    if (event.target.checked) {
      this.isValidForm[i] = line.plan && this.isSku(line);
    } else {
      this.isValidForm[i] = false;
    }
  }

  async addItem(line: Line) {
    const response = await this.presenter.addItem(this.user, this.customer, line);
    if (response) {
      line.expanded = false;
      this.sendLines.emit(this.lines);
      const leftLines = JSON.parse(
        JSON.stringify(this.lines.filter(l => !l.expanded)),
      );
      this.messageBus.emit('leftLinesChannel', 'leftLinesTopic', leftLines);
    }
  }

  saveItem(line: Line) {
    line.expanded = false;
  }

  editItem(i: number, line: Line) {
    this.lines[i].expanded = true;
    this.isUpdatePlans = false;
    const leftLines = JSON.parse(
      JSON.stringify(this.lines.filter(l => !l.expanded)),
    );
    this.messageBus.emit('leftLinesChannel', 'leftLinesTopic', leftLines);
    this.disableTGChipsEmitter.emit(false);
  }

  checkEditLeftLines() {
    this.editLeftLineRef = this.messageBus
      .on$('editLeftLineChannel', 'editLeftLineTopic')
      .subscribe(
        order =>
          (this.lines.find(line => line.order === order).expanded = true),
      );
  }

  removeItem(i: number, isIconDeleted:boolean) {
      
    this.confirmService.open('deleteLinePortability').subscribe(response => {
      if (response) {
        if(this.isNewLine){
          if(isIconDeleted !== false){
            for (let j = 0; j <= this.lines.length; j++) {
              if(typeof this.lines[j] !== 'undefined'){
                if(this.lines[j].option.value === "P"){
                  if(this.lines.length > 1){
                    this.changeDisplayLoyalty.emit(true);
                  }else{
                    this.changeDisplayLoyalty.emit(false);
                    break;
                  }
                }else{
                  if(this.lines[i].option.value === "P"){ 
                    this.changeDisplayLoyalty.emit(false);
                    break;
                  }
                }
              }
            }
          }else {
            this.changeDisplayLoyalty.emit(false);
          }
        }

        this.lines.splice(i, 1);
        this.lines.forEach((line, j) => {
          line.order = j + 1;
        });
        this.sendLines.emit(this.lines);
        this.linesForm.removeAt(i);
        this.removeLists(i);
        this.snackbarService.show('successDeleteLinePortability', 'success');
        const leftLines = JSON.parse(
          JSON.stringify(this.lines.filter(l => !l.expanded)),
        );
        this.messageBus.emit('leftLinesChannel', 'leftLinesTopic', leftLines);
        const optionPackFound = this.lines.some(
          element => element.option?.value === ESaleOption.Pack,
        );
        this.sendSaleOption.emit(optionPackFound);
        
        if (this.lines.length === 1) {
           this.productTypeDisabled = false;
        }
        this.index--;
        
      }
    });
  }

  removeLists(i: number) {
    this.presenter.campaigns.splice(i, 1);
    this.presenter.prices.splice(i, 1);
    this.presenter.plans.splice(i, 1);
    this.presenter.ubigeos.splice(i, 1);
    this.presenter.populatedCenters.splice(i, 1);
    this.isValidForm.splice(i, 1);
    this.showIMEI.splice(i, 1);
    this.autoSelect.splice(i, 1);
    this.oldValues.splice(i, 1);
    this.presenter.showSerieInfo.splice(i, 1);
    this.presenter.errorSerie.splice(i, 1);
  }

  unreadyToContinue(): boolean {
    const lines = this.lines ? true : false;
    const lenht = this.lines.length === 0 ? true : false;
    const expand = this.lines.some(line => !!line.expanded) ? true : false;
    return (
      this.lines &&
      (this.lines.length === 0 || this.lines.some(line => !!line.expanded))
    );
  }

  collapseSection() {
    this.collapse = !this.collapse;
  }

  reset(i: number, line: Line) {
    this.cleanEventEmit = true;
    line.modalityTo = null;
    if (this.lines.length<2) {
      line.productType = null
      if (!this.isRenoRepo) {
        line.option = null;
      }
    } 
    //line.productType = null;
    // if (!this.isRenoRepo) {
    //   line.option = null;
    // }
    line.iccid = null;
    line.imei = null;
    this.emptyData(i);
    line.campaign = null;
    line.price = null;
    line.totalPrice = '0.00';
    line.plan = null;
    line.department = null;
    line.ubigeo = null;
    line.populatedCenter = null;
  }
}
