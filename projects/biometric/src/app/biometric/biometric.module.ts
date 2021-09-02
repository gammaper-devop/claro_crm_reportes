import { NgModule } from '@angular/core';

import { CoreModule } from '@dashboard/app/core';
import { BiometricComponent } from './views/biometric/biometric.view';
import { SearchComponent } from './views/search/search.view';
import { SearchBarComponent } from './views/search/search-bar/search-bar.component';
import { CustomerCardComponent } from './views/search/customer-card/customer-card.component';
import { CustomerCardInfoComponent } from './views/search/customer-card/customer-card-info/customer-card-info.component';
import { ProfileComponent } from './views/profile/profile.view';
import { ProfileCardComponent } from './views/profile/profile-card/profile-card.component';


@NgModule({
  declarations: [BiometricComponent, SearchComponent, SearchBarComponent, CustomerCardComponent, CustomerCardInfoComponent, ProfileComponent, ProfileCardComponent ],
  imports: [CoreModule],
})
export class BiometricModule {}
