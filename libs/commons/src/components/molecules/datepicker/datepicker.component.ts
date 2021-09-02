import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'claro-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
  @ViewChild('date') date: ElementRef;
  @Input() placeholder = 'Seleccione';
  @Input() type = 'text';
  @Input() disabled = false;
  @Input() value = '';
  @Input() size = 'md';
  @Input() icon: string;
  @Input() minDate: Date | null;
  @Input() maxDate: Date | null;
  @Output() public valueChanged = new EventEmitter();
  @Output() public blurred = new EventEmitter();
  @Output() public enter = new EventEmitter();
  classes: string[];

  ngOnInit() {
    this.classes = ['w-100', 'size-' + this.size];
  }

  onChange(target) {
    try {
      const selectedDate = target.value._d;
 //     console.log('datepicker this.maxDate', this.maxDate, 'selectedDate', selectedDate, 'this.minDate', this.minDate, 'this.maxDate >= selectedDate', this.maxDate >= selectedDate, 'selectedDate >= this.minDate', selectedDate >= this.minDate )
      if (this.maxDate >= selectedDate && selectedDate >= this.minDate) {
        this.valueChanged.emit(target.value.toDate());
      } else if(selectedDate >= this.maxDate){
      //  this.date.nativeElement.value = '';
        this.valueChanged.emit(target.value.toDate());
      }
      else {
        setTimeout(() => {
            this.date.nativeElement.value = '';
            this.valueChanged.emit();
        }, );
      }
    } catch (error) {
      this.date.nativeElement.value = '';
      this.valueChanged.emit(target.value);   
    }
  }

  inputChange(e: InputEvent) {
    const date = e.target as HTMLInputElement;
    const x = date.value
      .replace(/\D/g, '')
      .match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
    date.value = !x[2] ? x[1] : x[1] + '/' + x[2] + (x[3] ? '/' + x[3] : '');
  }

  onBlur(target) {
    this.blurred.emit(target.value);
  }

  onEnter(target) {
    this.enter.emit(target.value);
  }
}
