import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ITHead } from '@claro/commons/src/components/organisms/table/table.interface';
import {
  ConfirmService,
  Messages,
  SnackbarService,
} from '@claro/crm/commons';
import {
  Customer,
  ContractPending,
  ContractPendingFilter,
} from '@contracts/app/core';
import { ContractsPresenter } from './contracts.presenter';

import { Router } from '@angular/router';
import { MemoryStorage, LocalStorage, SessionStorage } from '@claro/commons/storage';
import { UTILS } from '@claro/commons';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.view.html',
  styleUrls: ['./contracts.view.scss'],
  providers: [ContractsPresenter],
})
export class ContractsComponent {
  contractsForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  headerOne = 'Información del vendedor';
  headerTwo = 'Documentos pagados';
  indexTab: number;
  valueDate: Date;
  selectIndex: number;
  documentTypeId: string;
  selectItem: ContractPending;
  tableHeader: ITHead[] = [
    { id: '1', label: 'Id empleado' },
    { id: '2', label: 'Tipo doc.' },
    { id: '3', label: 'N° doc.' },
    { id: '4', label: 'Usuario' },
    { id: '5', label: 'Cod. punto venta' },
    { id: '6', label: 'Nombres' },
    { id: '7', label: 'Apellido paterno' },
    { id: '8', label: 'Apellido materno' },
    { id: '9', label: 'Teléfono' },
    { id: '10', label: 'Correo' },
  ];
  showActionBar = false;

  @Output() public activeActionBar = new EventEmitter();

  constructor(
    public presenter: ContractsPresenter,
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private confirmService: ConfirmService,
    private router: Router,
    private local: LocalStorage,
  ) {
    this.createForm();
    this.valueDate = new Date();
    this.indexTab = 0; 
  }

  createForm() {
    this.contractsForm = this.fb.group({
      datepicker: ['', Validators.required],
    });
  }

  compareService() {
    this.indexTab === 0
      ? this.presenter.getContracts(this.valueDate)
      : this.presenter.getPaid(this.valueDate);
  }

  clickContracts(event: any) {
    this.indexTab = event.index;
    this.resetDate();
    this.compareService();
  }

  clickDatePicker(event: any) {
    this.valueDate = event;
    this.compareService();
  }

  resetDate() {
    this.valueDate = new Date();
  }

  async openFiles(
    orderNumber: string,
    orderType: string,
    contract: ContractPendingFilter,
  ) {
    const detailPayment = await this.presenter.getDetailPayment(
      orderNumber,
      orderType,
    );
    if (!detailPayment) {
      return;
    }
    await this.presenter.postGenerateDocuments(detailPayment, contract);
  }

  deleteRow(index: number, contract: ContractPending) {
    this.confirmService.open('cancelOperation').subscribe(response => {
      if (response) {
        this.showActionBar = true;
        let message = Messages.cancelPaymentError.replace(
          'XXX',
          contract.orderNumber,
        );
        this.presenter
          .postCancelPayment(contract, this.indexTab === 1)
          .then((resp: boolean) => {
            if (resp) {
              message = Messages.cancelPaymentSuccess.replace(
                'XXX',
                contract.orderNumber,
              );
              this.snackbarService.show(message, 'success');
              this.presenter.contracts.splice(index, 1);
              this.presenter.payments.splice(index, 1);
              this.showActionBar = false;
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

  selectCustomer(customer: Customer) {
    this.presenter.setCustomer(customer);
  }

  async payNav() {
    const payment = this.selectItem;

    const detailPayment = await this.presenter.getDetailPayment(
      payment.orderNumber,
      payment.typeDocument,
    );
    if (!detailPayment) {
      return;
    }

    const body = {
      criteriaId: '1',
      searchText: this.selectItem.numberDocumentCustomer,
      documentTypeId: payment.codTypeDocumentCustomer,
    };
    await this.presenter.postSearchContracts(body);
    if (this.presenter.customers?.length) {
      const customer = this.presenter.customers[0];
      this.selectCustomer(customer);
      this.presenter.payNav(payment);
    }
  }

  async requestClaroPoint(){
    const demand = this.selectItem;

    const detailPayment = await this.presenter.getDetailPayment(
      demand.orderNumber,
      demand.typeDocument,
    );

    if (!detailPayment) {
      return;
    }

    if(detailPayment.claroPointUsed>0 && detailPayment.discountSoles>0){
      const body = {
        criteriaId: '1',
        searchText: this.selectItem.numberDocumentCustomer,
        documentTypeId: demand.codTypeDocumentCustomer,
      };

      await this.presenter.postSearchContracts(body);
      if (this.presenter.customers?.length) {
        const customer = this.presenter.customers[0];
        this.selectCustomer(customer);
        const date: Date = new Date();
          const dataPrint = {
            officeAttention: this.presenter.user.officeDescription,
            customer: customer.fullName,
            legalRepresentative: '',
            documentType: customer.documentTypeDescription,
            documentNumber: customer.documentNumber,
            date: UTILS.formatDate(date),
            interaction: detailPayment.idOrderMSSAP,
            lineNmber: customer.phoneNumber,
            description: 'Descuentos Por Reposición',
            points: detailPayment.claroPointUsed,
            quantity: '1',
            discount: detailPayment.discountSoles,
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
    } 
  }

  tSelectValue(selectedRow: {
    item: ContractPendingFilter;
    index: number;
    action: string;
  }) {
    this.selectItem = this.presenter.payments[selectedRow.index];
    this.selectIndex = selectedRow.index;
    switch (selectedRow.action) {
      case 'print':
        this.requestClaroPoint();
        this.openFiles(
          this.selectItem.orderNumber,
          this.selectItem.typeDocument,
          selectedRow.item,
        );
        break;
      case 'delete':
        this.deleteRow(this.selectIndex, this.selectItem);
        break;
      case 'payment':
        this.payNav();
        break;
      default:
        break;
    }
  }
}
