import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MicroAppLoaderComponent } from '@claro/crm/commons';
import { AuthGuard, NoAuthGuard } from '../core';
import { ShellComponent } from './views/shell/shell.view';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        component: MicroAppLoaderComponent,
        canActivate: [NoAuthGuard],
        data: { microName: 'crm-login' }
      },
      {
        path: 'dashboard',
        component: MicroAppLoaderComponent,
        canActivate: [AuthGuard],
        data: { microName: 'crm-dashboard' }
      },
      {
        path: 'clientes',
        component: MicroAppLoaderComponent,
        canActivate: [AuthGuard],
        data: { microName: 'crm-customers' }
      },
      {
        path: 'clientes/:route',
        component: MicroAppLoaderComponent,
        canActivate: [AuthGuard],
        data: { microName: 'crm-customers' }
      },
      {
        path: 'contratos',
        component: MicroAppLoaderComponent,
        canActivate: [AuthGuard],
        data: { microName: 'crm-contracts' }
      },
      {
        path: 'vendedores',
        component: MicroAppLoaderComponent,
        canActivate: [AuthGuard],
        data: { microName: 'crm-sellers' }
      },
      {
        path: 'biometria',
        component: MicroAppLoaderComponent,
        canActivate: [AuthGuard],
        data: { microName: 'crm-biometric' }
      },
      {
        path: 'reportes',
        component: MicroAppLoaderComponent,
        canActivate: [AuthGuard],
        data: { microName: 'crm-reports' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule {}
