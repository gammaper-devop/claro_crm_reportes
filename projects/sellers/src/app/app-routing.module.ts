import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmptyComponent } from '@claro/commons';
import { RegisterComponent } from './sellers/views/register/register.view';
import { SearchComponent } from './sellers/views/search/search.view';

const routes: Routes = [
  { path: 'vendedores',
  children: [
    { path: '', redirectTo: 'busqueda', pathMatch: 'full'},
    { path: 'busqueda', component: SearchComponent },
    { path: 'registro', component: RegisterComponent },
    ]
  },
  { path: '**', component: EmptyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
