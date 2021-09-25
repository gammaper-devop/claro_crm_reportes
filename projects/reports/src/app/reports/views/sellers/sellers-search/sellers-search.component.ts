import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { EInputValidation } from '@claro/commons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CRMReportsService, ExportExcelService, ListSellersReport, ListSellersReportsToExcel, PortabilityParam, RegionParam } from '@reports/app/core';
import { SellersPresenter } from '../sellers.presenter';
import {
  DocumentType, Generics,
} from '@claro/crm/commons';
import { ChildDealerParam, MainDealerParam } from '@reports/app/core/models/dealers.model';
import { AuthService, User } from '@shell/app/core';

const EXCEL_FILE_NAME = 'REPORTE DE VENDEDORES';
@Component({
  selector: 'app-sellersearch',
  templateUrl: './sellers-search.view.html',
  styleUrls: ['./sellers-search.component.scss'],
  providers: [SellersPresenter]
})
export class SellersSearchComponent implements OnInit {
  @Output() searchSellersEvent = new EventEmitter();

  isInitRoute: boolean;
  reportStatus: PortabilityParam[];
  documentTypes: DocumentType[];
  reportRegion: RegionParam[];
  mainDealer: MainDealerParam[];
  childDealer: ChildDealerParam[];

  valueDate: Date;
  body: any;
  reportsForm: FormGroup;
  enableReport: boolean = false;
  selectValue = '';
  maxLength = 11;
  inputType: EInputValidation;
  type: string;
  inactiveCreate: boolean;
  inactiveCreateButton: boolean;
  isValidPhoneService = false;

  user: User;
  optionStatus: PortabilityParam[];
  reportToExcel: ListSellersReportsToExcel[]
  dataSourceSellers: ListSellersReport[];
  constructor(private fb: FormBuilder, 
    public presenter: SellersPresenter,  
    private exportExcelService: ExportExcelService,
    private authService: AuthService) {
 
    this.user = this.authService.getUser();
    this.createForm();
  }

  ngOnInit() {
    
    this.getCboSellers();
    this.getReportsDealers();
    this.getCboSellersRegion();
  }

  createForm() {
    this.reportsForm = this.fb.group({
      documentType: [''],
      documentNumber: [''],
      status: [''],
      region: [''],
      seller: [''],
      startDate: [''],
      endDate: [''],
      descriptionPdv: ['']
    });
  }

  async onSearch() {
    this.enableReport = true;

    this.body = {
      documentType: this.reportsForm.get('documentType').value,
      documentNumber: this.reportsForm.get('documentNumber').value,
      accountNet: this.user.account,
      registrationDate: this.reportsForm.get('startDate').value,
      lowDate: this.reportsForm.get('endDate').value, 
      dealerCode: this.reportsForm.get('seller').value,
      regionDes: this.reportsForm.get('region').value,
      pointSaleCode: this.reportsForm.get('descriptionPdv').value,
      typeSearch: this.reportsForm.get('status').value
    };
    
    const response = await this.presenter.listSellers(this.body);

    this.dataSourceSellers = response;
    console.log("JSON Final: " + JSON.stringify(this.dataSourceSellers));
    this.searchSellersEvent.emit(this.dataSourceSellers);
  }

  getCboSellers() {
    this.presenter.getCboSellers('CBO_EST_VEN').subscribe((options: Generics[]) => {
      this.reportStatus = options;
    });
  }

  getCboSellersRegion() {
    this.presenter.getCboSellers('CBO_RGN').subscribe((options: Generics[]) => {
      this.reportRegion = options;
    });
  }


  getReportsDealers() {
    const body = {
      dealerCodeSalePoint: ""
    };
    this.presenter.getDealersReports(body).subscribe(data => {
      this.mainDealer = data;
    })
  }

  changeDocType(e) {

  }

  changeState(state: string) {
  }

  changeRegion(region: string) {
  }

  changeSeller(seller: string) {
    console.log("Ingreso changeSeller. ", seller);
    const bodySelected = {
      dealerCodeSalePoint : seller
    }
    this.presenter.getDealersReportsSelected(bodySelected).subscribe(data => {
      this.childDealer = data;
    })
  }

  valueChanged(e) {

  }

  tSelectValue(e) {

  }
  onSubmit() {
    this.reportToExcel = this.dataSourceSellers.map(dataSellersI => new ListSellersReportsToExcel(dataSellersI));
    this.exportExcelService.exportToExcel(this.reportToExcel, EXCEL_FILE_NAME);
  }
}