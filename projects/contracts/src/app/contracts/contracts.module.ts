import { NgModule } from '@angular/core';

import { CoreModule } from '@dashboard/app/core';
import { ContractsComponent } from './views/contracts/contracts.view';

@NgModule({
  declarations: [ContractsComponent],
  imports: [CoreModule],
})
export class ContractsModule {}
