import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { ITHead, ITActions } from './table.interface';
import { UTILS } from '../../../../../../libs/commons/src/helpers/utilities';

@Component({
  selector: 'claro-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class ClaroTableComponent implements OnInit {
  @Input() thead: ITHead;
  @Input() tbody: any;
  @Input() user: any;
  @Input() btnPayment: any;
  @Input() actions: ITActions[];
  @Input() showActionBar = false;
  @Output() selected = new EventEmitter();

  selectedRow: { item: any; index: number };
  selectedInput: MatRadioButton;
  isIE: boolean;

  constructor() {
    this.isIE = UTILS.isIE();
  }
  ngOnInit(){
    console.log('user', this.user)
  }


  returnRowItem(item: any, index: number) {
    return item[Object.keys(item)[index]];
  }

  onChange(event: MatRadioChange, index: number) {
    this.showActionBar = true;
    this.selectedInput = event.source;
    this.selectedRow = { item: event.value, index: index };
  }

  actionBarEmit(action: string) {
    this.selected.emit({ action, ...this.selectedRow });
  }
}
