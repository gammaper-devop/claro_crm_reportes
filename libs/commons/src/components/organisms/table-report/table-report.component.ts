import { Component, Input, OnInit } from '@angular/core';
import { ITHead } from './table-report.interface';
import { UTILS } from '../../../../../../libs/commons/src/helpers/utilities';

@Component({
  selector: 'claro-table-report',
  templateUrl: './table-report.component.html',
  styleUrls: ['./table-report.component.scss']
})
export class TableReportComponent implements OnInit {

  @Input() thead: ITHead;
  @Input() tbody: any;

  isIE: boolean;
  
  constructor(
    
  ) {
    this.isIE = UTILS.isIE();
   }

  ngOnInit() {
  }

  returnRowItem(item: any, index: number) {
    return item[Object.keys(item)[index]];
  }

}
