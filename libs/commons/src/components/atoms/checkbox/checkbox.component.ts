import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'claro-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input() name = 'name';
  @Input() attrId = 'id';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() text = '';
  @Output() changed = new EventEmitter();

  onChanged(event) {
    if (!this.disabled) {
      this.changed.emit(event);
    }
  }
}
