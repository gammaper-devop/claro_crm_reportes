import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'claro-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent {
  @Input() name = 'name';
  @Input() attrId = 'id';
  @Input() value = 'value';
  @Input() disabled = false;
  @Input() text = 'Default';
  @Output() changed = new EventEmitter();

  onChanged(event) {
    if (!this.disabled) {
      this.changed.emit(event.target.value);
    }
  }
}
