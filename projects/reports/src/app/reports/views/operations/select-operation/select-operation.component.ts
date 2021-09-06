import { Component, OnInit } from '@angular/core';
import { SelectOperationPresenter } from './select-operation.presenter.service';

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
  ) {}

  ngOnInit() {
    this.operations = [
      {
        label: 'Vendedores',
        value: 1
      },
      {
        label: 'Clientes',
        value: 2
      }
    ]
  }

  valueChanged(value: string) {

  }
}

export interface Operations{
  label: string,
  value: number
}
