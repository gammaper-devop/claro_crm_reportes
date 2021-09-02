import { NgModule } from '@angular/core';

import { CoreModule } from '@dashboard/app/core';
import { RegisterComponent } from './views/register/register.view';
import { RemoveSellerComponent } from './views/search/remove-seller/remove-seller.component';
import { SearchBarComponent } from './views/search/search-bar/search-bar.component';
import { SearchComponent } from './views/search/search.view';
import { SellersCardComponent } from './views/search/sellers-card/sellers-card.component';
import { SellersHistoryComponent } from './views/search/sellers-card/sellers-history/sellers-history.component';

@NgModule({
  declarations: [
    SearchComponent,
    RegisterComponent,
    SearchBarComponent,
    SellersCardComponent,
    SellersHistoryComponent,
    RemoveSellerComponent,
  ],
  imports: [CoreModule],
})
export class SellersModule {}
