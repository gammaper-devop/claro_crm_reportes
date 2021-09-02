import { Directive, forwardRef, HostListener, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[claroReactiveForm]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReactiveFormDirective),
      multi: true
    }
  ]
})
export class ReactiveFormDirective implements ControlValueAccessor {

  // @HostBinding('disable') hostDisabled: boolean;
  // @HostBinding('value') hostValue;

  protected lastValue;
  private onChange: (value) => void;
  private onTouched: () => void;

  writeValue(value) {

    // this.hostValue = this.lastValue = value == null ? '' : value;
  }

  registerOnChange(fn: (value) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    // this.hostDisabled = isDisabled;
  }

  @HostListener('valueChanged', ['$event'])
  _handleInputEvent(value) {
    if (JSON.stringify(value) !== JSON.stringify(this.lastValue)) {
      this.lastValue = value;
      this.onChange(value);
      this.onTouched();
    }
  }
  @HostListener('changed', ['$event'])
  _handleRadioEvent(value) {
    if (JSON.stringify(value) !== JSON.stringify(this.lastValue)) {
      this.lastValue = value;
      this.onChange(value);
      this.onTouched();
    }
  }

  @HostListener('elementBlurred')
  _handleBlurEvent() {
    this.onTouched();
  }

}
