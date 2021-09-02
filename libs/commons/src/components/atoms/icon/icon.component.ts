import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'claro-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() name: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg';
  classes: {};

  ngOnInit() {
    this.classes = {
      'crm-icon': true,
    };
    this.classes['size-' + (this.size || 'sm')] = true;
  }
}
