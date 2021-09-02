import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { Providers } from './app.config';
import { AppComponent } from './app.component';
import { ReportsModule } from './reports/reports.module';
//import { ReportsComponent } from './reports/views/reports/reports.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    ReportsModule,
  ],
  providers: Providers,
  entryComponents: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
    const element = createCustomElement(AppComponent, {
      injector: this.injector
    });
    if (!customElements.get('crm-reports')) {
      customElements.define('crm-reports', element);
    }
  }
}

