import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'claro-collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.scss'],
})
export class CollapseComponent implements OnInit {
  @Input() text: string;
  @Input() disabled: boolean;
  @Input() expanded: boolean;
  @Input() hideToggle: boolean;
  @Input() iconName: string;
  @Output() closed = new EventEmitter();
  @Output() opened = new EventEmitter();
  @Output() iconClicked = new EventEmitter();
  classes: {};

  ngOnInit() {
    this.classes = {
      'claro-collapse': true,
      'without-title': !this.text,
    };
  }

  onOpened() {
    this.opened.emit();
  }
  onClosed() {
    this.closed.emit();
  }

  onIconClicked(e) {
    e.stopPropagation();
    this.iconClicked.emit();
  }
}
