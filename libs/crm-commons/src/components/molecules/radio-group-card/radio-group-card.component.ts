import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IRadioGroupCardOption } from './radio-group-card.interface';

@Component({
  selector: 'crm-radio-group-card',
  templateUrl: './radio-group-card.component.html',
  styleUrls: ['./radio-group-card.component.scss']
})
export class RadioGroupCardComponent implements OnInit {
  @Input() value = '';
  @Input() options: IRadioGroupCardOption[];
  @Output() public valueChanged = new EventEmitter();
  @Output() public elementBlurred = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onChange(ev) {
    this.valueChanged.emit(ev.value);
  }

  onTouched() {
    this.elementBlurred.emit();
  }

}
