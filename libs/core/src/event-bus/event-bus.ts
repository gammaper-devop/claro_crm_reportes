import { IEvent, IEventBus } from './global';

export class EventBus implements IEventBus {
  private static window = window as any;
  private events: IEvent[];

  constructor() {
    this.events = [];
  }

  static getInstance(): EventBus {
    if (!this.window.eventbus) {
      this.window.eventbus = new EventBus();
    }

    return this.window.eventbus;
  }

  $emit(eventName: string, data?: any): void {
    const event = this.events.find((e: IEvent) => e.eventName === eventName);
    if (event) {
      event.handlerFn(data);
    }
  }

  $on(eventName: string, handlerFn: any): void {
    this.events.push({ eventName, handlerFn });
  }
}
