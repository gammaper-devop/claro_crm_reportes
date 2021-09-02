import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Components, EntryComponents } from './components';
import { MaterialModule } from './components/material.module';

import { Services } from './services';
import { ProgressbarService } from './components/atoms/progressbar/progressbar.service';
import { Directives } from './directives';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [...Components, Directives],
  exports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    Directives,
    ...Components
  ],
  entryComponents: EntryComponents,
  providers: [ProgressbarService, ...Services]
})
export class CommonsModule {}
