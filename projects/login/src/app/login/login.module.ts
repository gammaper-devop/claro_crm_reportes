import { NgModule } from '@angular/core';

import { CoreModule } from '@login/app/core';
import { LoginComponent } from './views/login/login.view';
import { AccountStepComponent } from './views/login/account-step/account-step.component';
import { IdentificationStepComponent } from './views/login/identification-step/identification-step.component';
import { BiometricStepComponent } from './views/login/biometric-step/biometric-step.component';
import { PinStepComponent } from './views/login/pin-step/pin-step.component';
import { ValidationStepComponent } from './views/login/validation-step/validation-step.component';
import { SuccessStepComponent } from './views/login/success-step/success-step.component';
import { ErrorStepComponent } from './views/login/error-step/error-step.component';

@NgModule({
  declarations: [
    LoginComponent,
    AccountStepComponent,
    IdentificationStepComponent,
    BiometricStepComponent,
    PinStepComponent,
    ValidationStepComponent,
    SuccessStepComponent,
    ErrorStepComponent
  ],
  imports: [CoreModule]
})
export class LoginModule {}
