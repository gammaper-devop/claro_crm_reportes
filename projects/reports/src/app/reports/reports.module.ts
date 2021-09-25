import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreModule } from '@dashboard/app/core';
import { OperationsComponent } from './views/operations/operations.component';
import { SelectOperationComponent } from './views/operations/select-operation/select-operation.component';
import { SellersSearchComponent } from './views/sellers/sellers-search/sellers-search.component';
import { SellersComponent } from './views/sellers/sellers.component';

@NgModule({
  declarations: [
                 OperationsComponent,
                 SelectOperationComponent,
                 SellersComponent, 
                 SellersSearchComponent
                ],
  imports: [CoreModule, ReactiveFormsModule, RouterModule],
})
export class ReportsModule {}
