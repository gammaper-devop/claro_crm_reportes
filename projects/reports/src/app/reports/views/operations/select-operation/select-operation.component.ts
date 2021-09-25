import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemoryStorage } from '@claro/commons/storage';
import { CRMReportsService, PortabilityParam } from '@reports/app/core';
import { SellersPresenter } from '../../sellers/sellers.presenter';

@Component({
  selector: 'app-select-operation',
  templateUrl: './select-operation.component.html',
  styleUrls: ['./select-operation.component.scss'],
})
export class SelectOperationComponent implements OnInit, OnDestroy {
  isInitRoute: boolean;
  operations: Operations[];
  reportStatus: PortabilityParam[];
  constructor(
    private router: Router,
    private memory: MemoryStorage,
    private reportsService: CRMReportsService
  ) {}
  ngOnDestroy(): void {
    this.reportsService.removeInitRoute();
  }

  ngOnInit() {
    this.operations = [
      {
        label: 'Vendedores',
        value: 1,
        icon: "reports-1"
      },
      /* {
        label: 'Clientes',
        value: 2, 
        icon: "operation-02"
      },
      {
        label: 'Contratos',
        value: 3, 
        icon: "operation-03"
      }*/
    ]
  }

  valueChanged(value: string) {
    if (value = '1'){
      this.router.navigate(['/reportes/distribuidores']);
    }
  }
}


export interface Operations{
  label: string,
  value: number,
  icon: string
}
