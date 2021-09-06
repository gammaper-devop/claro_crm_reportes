import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreModule } from '@dashboard/app/core';
import { ReportsComponent } from './views/reports/reports.view';
import { OperationsComponent } from './views/operations/operations.component';
import { SelectOperationComponent } from './views/operations/select-operation/select-operation.component';

@NgModule({
  declarations: [ReportsComponent, OperationsComponent, SelectOperationComponent],
  imports: [CoreModule, ReactiveFormsModule, RouterModule],
})
export class ReportsModule {}
