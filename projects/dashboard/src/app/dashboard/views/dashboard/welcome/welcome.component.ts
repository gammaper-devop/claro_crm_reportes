import { Component, Input } from '@angular/core';

import { User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  @Input() user: User;
  cdn = environment.cdn;
}
