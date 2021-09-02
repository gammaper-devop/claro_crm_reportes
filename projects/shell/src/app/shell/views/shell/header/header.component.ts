import { Component, Input, EventEmitter, Output, HostListener } from '@angular/core';

import { Channels } from '@claro/crm/commons';
import { Menu, User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() user: User;
  @Input() opened: boolean;
  @Output() openedChange = new EventEmitter<boolean>();
  @Input() menus: Menu[];
  @Input() activatedRoute: string;
  @Output() logout = new EventEmitter<null>();
  cdn = environment.cdn;
  channels = Channels;
  isExpanded = false;

  hide() {
    this.isExpanded = false;
  }

  sidenavToggle() {
    this.opened = !this.opened;
    this.openedChange.emit(this.opened);
  }

  handleLogout() {
    this.logout.emit();
  }

  expand() {
    this.isExpanded = !this.isExpanded;
  }
}
