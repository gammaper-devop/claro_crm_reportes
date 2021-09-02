import { Injectable, ModuleWithProviders, NgModule } from '@angular/core';

import { EventBus as ClaroEventBus, IEventBus } from '@claro/core';

@Injectable()
export class EventBus extends ClaroEventBus {}

export function eventBus(): IEventBus {
  return EventBus.getInstance();
}

@NgModule()
export class EventBusModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: EventBusModule,
      providers: [{ provide: EventBus, useFactory: eventBus }]
    };
  }
}
