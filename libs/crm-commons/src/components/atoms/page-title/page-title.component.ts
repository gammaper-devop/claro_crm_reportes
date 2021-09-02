import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'crm-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {
  @Input() label: string;
  @Input() back = false;
  @Output() handleBack = new EventEmitter<{}>();

  goBack() {
    this.handleBack.emit();
  }
}
