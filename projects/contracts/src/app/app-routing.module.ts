import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmptyComponent } from '@claro/commons';
import { ContractsComponent } from './contracts/views/contracts/contracts.view';

const routes: Routes = [
  { path: 'contratos', component: ContractsComponent },
  { path: '**', component: EmptyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
