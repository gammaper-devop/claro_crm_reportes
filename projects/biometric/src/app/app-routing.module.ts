import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmptyComponent } from '@claro/commons';
import { BiometricComponent } from './biometric/views/biometric/biometric.view';
import { ProfileComponent } from './biometric/views/profile/profile.view';
import { SearchComponent } from './biometric/views/search/search.view';

const routes: Routes = [
  { path: 'biometria', component: SearchComponent },
  { path: 'biometria/clientes/perfil', component: ProfileComponent },
  { path: 'biometria/clientes/validacion', component: BiometricComponent },
  { path: '**', component: EmptyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
