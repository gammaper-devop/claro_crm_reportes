import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmptyComponent } from '@claro/commons';
import { DashboardComponent } from './dashboard/views/dashboard/dashboard.view';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', component: EmptyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
