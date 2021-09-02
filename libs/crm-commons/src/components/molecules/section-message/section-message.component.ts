import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'crm-section-message',
  templateUrl: './section-message.component.html',
  styleUrls: ['./section-message.component.scss'],
})
export class SectionMessageComponent implements OnInit, OnChanges {
  @Input() iconName = '';
  @Input() id = '';
  @Input() title = '';
  @Input() description = '';
  @Input() color: 'success' | 'wrong' = 'success';

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {}
}
