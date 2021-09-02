import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

export enum EInputValidation {
  Number = 'number',
  Alpha = 'alpha',
  Alphanumeric = 'alphanumeric',
  Text = 'text',
}

@Component({
  selector: 'claro-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() disabled = false;
  @Input() value = '';
  @Input() maxLength = '524288';
  @Input() size = 'md';
  @Input() icon: string;
  @Input() paste = true;
  @Input() inputValidation: EInputValidation;
  @Output() public valueChanged = new EventEmitter();
  @Output() public blurred = new EventEmitter();
  @Output() public enter = new EventEmitter();
  classes: string[];
  maxLimitLength = 524288;
  maxInputLength = this.maxLimitLength;
  expression: RegExp;

  ngOnInit() {
    this.classes = ['w-100', 'size-' + this.size];
  }

  onChange(target) {
    switch (this.inputValidation) {
      case EInputValidation.Number:
        this.expression = /[A-Za-zÑÁÉÍÓÚñáéíóú`~!¡@#$%^&*()_|+\-=?;:'",.<>° ]/g;
        break;
      case EInputValidation.Alpha:
        this.expression = /[0-9`~!¡@#$%^&*()_|+\-=?;:'",.<>° ]/g;
        break;
      case EInputValidation.Alphanumeric:
        this.expression = /[`~!¡@#$%^&*()_|+\-=?;:'",.<>° ]/g;
        break;
      case EInputValidation.Text:
        this.expression = /[0-9`~!¡@#$%^&*()_|+\-=?;:'",.<>°]/g;
        break;
    }
    if (this.expression) {
      target.value = target.value
        .replace(this.expression, '')
        .substr(0, Number(this.maxLength));
    }
    this.maxInputLength =
      target.value.length > 0 ? Number(this.maxLength) : this.maxLimitLength;
    this.valueChanged.emit(target.value);
  }

  onBlur(target) {
    this.blurred.emit(target.value);
  }

  onEnter(event, value) {
    this.enter.emit(value || event.target.value);
  }

  onPaste(event: ClipboardEvent) {
    if ((window as any).clipboardData) {
      const pastedText = (window as any).clipboardData;
    } else {
      const pastedText = event.clipboardData.getData('text');
    }
    return this.paste;
  }
}
