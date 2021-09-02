import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import {
  EIconButtonColor,
  EIconButtonSize,
  EIconButtonStyle,
  EIconButtonType,
} from './icon-button.enum';

@Component({
  selector: 'claro-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent implements OnInit {
  @Input() name: string;
  @Input() type: EIconButtonType = EIconButtonType.button;
  @Input() styl: EIconButtonStyle = EIconButtonStyle.icon;
  @Input() color: EIconButtonColor = EIconButtonColor.primary;
  @Input() size: EIconButtonSize = EIconButtonSize.md;
  @Input() disabled = false;
  @Input() text = '';
  @Output() clicked = new EventEmitter();
  classes: {};

  ngOnInit() {
    this.classes = {
      'claro-button': !!this.text,
      'icon-button-custom': !this.text,
    };
    this.classes['styl-' + this.styl] = true;
    this.classes['color-' + this.color] = true;
    this.classes['size-' + this.size] = true;
  }

  onClicked(e) {
    this.clicked.emit(e);
  }
}
