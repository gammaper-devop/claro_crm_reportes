import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmptyComponent } from '@claro/commons';
import { OperationsComponent } from './reports/views/operations/operations.component';
import { SellersComponent } from './reports/views/sellers/sellers.component';

const routes: Routes = [
  { path: 'reportes', 
    children: [
        { path: '', redirectTo: 'operaciones', pathMatch: 'full' },
        { path: 'operaciones', component: OperationsComponent },
        { path: 'distribuidores',  component: SellersComponent }
    ]
  },
  { path: '**', component: EmptyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
