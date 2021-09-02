import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'claro-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TabsComponent {
  @Input() labelOne = 'Default One';
  @Input() labelTwo = 'Default Two';

  @Output() clickedTabs = new EventEmitter();

  selectEvent($event) {
    this.clickedTabs.emit($event);
  }
}
