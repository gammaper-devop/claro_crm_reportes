import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmptyComponent } from '@claro/commons';
import { ReportsComponent } from './reports/views/reports/reports.view';



const routes: Routes = [
  { path: 'reportes', component: ReportsComponent },
  { path: '**', component: EmptyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
