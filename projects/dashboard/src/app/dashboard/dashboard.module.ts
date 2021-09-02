import { NgModule } from '@angular/core';

import { CoreModule } from '@dashboard/app/core';
import { DashboardComponent } from './views/dashboard/dashboard.view';
import { WelcomeComponent } from './views/dashboard/welcome/welcome.component';

@NgModule({
  declarations: [DashboardComponent, WelcomeComponent],
  imports: [CoreModule]
})
export class DashboardModule {}
