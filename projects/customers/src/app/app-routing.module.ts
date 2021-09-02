import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmptyComponent } from '@claro/commons';
import { SearchComponent } from '@customers/app/customers/views/search/search.view';
import { OperationsComponent } from '@customers/app/customers/views/operations/operations.view';
import { ProfileComponent } from '@customers/app/customers/views/profile/profile.view';
import { RegisterComponent } from './customers/views/register/register.view';
import { SuccessSaleComponent } from './customers/views/success-sale/success-sale.view';
import { CustomerGuard, SaleGuard } from './core/guards';
import { ClaroclubPrintComponent } from './customers/views/operations/steps/claroclub-print/claroclub-print.component';
import { NoBiometricPrintComponent } from './customers/views/operations/steps/no-biometric-print/no-biometric-print.component';

const routes: Routes = [
  {
    path: 'clientes',
    children: [
      { path: '', redirectTo: 'busqueda', pathMatch: 'full' },
      { path: 'busqueda', component: SearchComponent },
      { path: 'registro', component: RegisterComponent },
      {
        path: 'perfil',
        component: ProfileComponent,
        canActivate: [CustomerGuard],
      },
      {
        path: 'operaciones',
        component: OperationsComponent,
        canActivate: [CustomerGuard],
        canDeactivate: [CustomerGuard],
      },
      {
        path: 'venta-exitosa',
        component: SuccessSaleComponent,
        canActivate: [SaleGuard],
      },
      {
        path: 'claroclub-impresion',
        component: ClaroclubPrintComponent,
      },
      {
        path: 'nobiometria-impresion',
        component: NoBiometricPrintComponent,
      },
    ],
  },
  { path: '**', component: EmptyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
