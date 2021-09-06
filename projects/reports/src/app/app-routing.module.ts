import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmptyComponent } from '@claro/commons';
import { OperationsComponent } from './reports/views/operations/operations.component';
import { ReportsComponent } from './reports/views/reports/reports.view';

// const routes: Routes = [
//   { path: 'reportes', component: ReportsComponent },
//   { path: 'reportes/operaciones', component: OperationsComponent },
//   { path: '**', component: EmptyComponent },
// ];

const routes: Routes = [
  { path: 'reportes', component: OperationsComponent,
    children: [
        { 
          path: 'operaciones', 
          component: OperationsComponent
        },
    ]
  },
  { path: '**', component: EmptyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
