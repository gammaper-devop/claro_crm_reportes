import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import {
  EButtonColor,
  EButtonSize,
  EButtonStyle,
  EButtonType,
} from './button.enum';

@Component({
  selector: 'claro-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() type: EButtonType = EButtonType.button;
  @Input() styl: EButtonStyle = EButtonStyle.flat;
  @Input() color: EButtonColor = EButtonColor.primary;
  @Input() size: EButtonSize = EButtonSize.md;
  @Input() disabled = false;
  @Input() text = 'Default';
  @Output() clicked = new EventEmitter();
  classes: string[];

  ngOnInit() {
    this.classes = [
      'claro-button',
      'styl-' + this.styl,
      'color-' + this.color,
      'size-' + this.size,
    ];
  }

  onClicked() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
