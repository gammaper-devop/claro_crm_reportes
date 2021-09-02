import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'claro-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent {
  @Input() text = '';
  @Input() position = 'after';
  @Input() checked = false;
  @Input() disabled = false;
  @Output() valueChanged = new EventEmitter();

  onChange(event: MatSlideToggleChange) {
    this.valueChanged.emit(event.checked);
  }
}
