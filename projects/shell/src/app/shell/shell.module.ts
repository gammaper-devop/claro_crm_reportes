import { NgModule } from '@angular/core';

import { MicroAppLoaderModule } from '@claro/crm/commons';
import { CoreModule } from '@shell/app/core';
import { ShellRoutingModule } from './shell-routing.module';
import { ShellComponent } from './views/shell/shell.view';
import { HeaderComponent } from './views/shell/header/header.component';
import { TracingComponent } from './views/shell/tracing/tracing.component';

@NgModule({
  declarations: [ShellComponent, HeaderComponent, TracingComponent],
  imports: [MicroAppLoaderModule, CoreModule, ShellRoutingModule],
  entryComponents: [HeaderComponent],
})
export class ShellModule {}
