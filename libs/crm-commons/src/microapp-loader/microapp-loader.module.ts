import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MicroAppConfigService } from './microapp-config.service';
import { MicroAppLoaderComponent } from './microapp-loader.component';


@NgModule({
  imports: [CommonModule],
  declarations: [MicroAppLoaderComponent],
  exports: [MicroAppLoaderComponent],
  providers: [MicroAppConfigService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MicroAppLoaderModule {}
