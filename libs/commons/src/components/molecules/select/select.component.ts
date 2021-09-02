import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
} from '@angular/core';
import { Options } from '../../../models/options';

@Component({
  selector: 'claro-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit, OnChanges {
  @Input() value: any = '';
  @Input() disabled = false;
  @Input() placeholder = 'Selecciona una opción';
  @Input() options: Options[] = [];
  @Input() size = 'md';
  @Input() isObject = false;
  @Input() autoSelect = true;
  @Output() public valueChanged = new EventEmitter();
  @Output() public elementBlurred = new EventEmitter();
  classes: string[];

  ngOnInit() {
    this.classes = ['w-100', 'size-' + this.size];
  }

  ngOnChanges() {

    if (!this.value && this.options?.length > 1) {
      this.disabled = false;
    }
    if (this.autoSelect && !this.value && this.options?.length === 1) {
      setTimeout(() => {
        this.value = this.isObject ? this.options[0] : this.options[0].value;
        this.valueChanged.emit(this.value);
        this.disabled = true;
      });
    }

  }

  onChange(ev) {
    this.valueChanged.emit(ev.value);
  }

  onTouched() {
    this.elementBlurred.emit();
  }
}
