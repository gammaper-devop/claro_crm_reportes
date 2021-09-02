import { Component } from '@angular/core';

import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-success-step',
  templateUrl: './success-step.component.html',
  styleUrls: ['./success-step.component.scss']
})
export class SuccessStepComponent {
  cdn = environment.cdn;

  constructor() {}
}
