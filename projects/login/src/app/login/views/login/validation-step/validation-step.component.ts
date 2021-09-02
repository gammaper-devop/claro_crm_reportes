import { Component } from '@angular/core';

import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-validation-step',
  templateUrl: './validation-step.component.html',
  styleUrls: ['./validation-step.component.scss']
})
export class ValidationStepComponent {
  cdn = environment.cdn;

  constructor() {}
}
