import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreModule } from '@dashboard/app/core';
import { ReportsComponent } from './views/reports/reports.view';

@NgModule({
  declarations: [ReportsComponent],
  imports: [CoreModule, ReactiveFormsModule, RouterModule],
})
export class ReportsModule {}
