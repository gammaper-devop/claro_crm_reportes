import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Line } from '@customers/app/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DispatchOptionsPresenter } from './dispatch-options.presenter';
import { IParameter } from '@customers/app/core';

@Component({
  selector: 'app-dispatch-options',
  templateUrl: './dispatch-options.component.html',
  styleUrls: ['./dispatch-options.component.scss'],
  providers: [DispatchOptionsPresenter],
})
export class DispatchOptionsComponent implements OnInit {
  @Input() lines: Line[];
  @Output() dispatchOptionsSelected = new EventEmitter<IParameter>();

  dispatchOptionsForm: FormGroup;
  isOperationTypeRepo: boolean;

  constructor(
    public presenter: DispatchOptionsPresenter,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.dispatchOptionsForm = this.fb.group({
      dispatchOptions: null,
    });
  }

  changeDispatchOptions(data: IParameter) {
    this.dispatchOptionsSelected.emit(data);
  }
}
