import { Component, OnInit } from '@angular/core';
import { SelectOperationPresenter } from './select-operation.presenter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-operation',
  templateUrl: './select-operation.component.html',
  styleUrls: ['./select-operation.component.scss'],
  providers: [SelectOperationPresenter],
})
export class SelectOperationComponent implements OnInit {

  operations: Operations[];

  constructor(
    public presenter: SelectOperationPresenter,
    private router: Router
  ) {}

  ngOnInit() {
    this.operations = [
      {
        label: 'Vendedores',
        value: 1,
        icon: "operation-01"
      },
      {
        label: 'Clientes',
        value: 2, 
        icon: "operation-02"
      },
      {
        label: 'Contratos',
        value: 3, 
        icon: "operation-03"
      }
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
