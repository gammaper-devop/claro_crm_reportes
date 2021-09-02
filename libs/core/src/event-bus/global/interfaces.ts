export interface IEventBus {
  $emit(eventName: string, data?: any): void;
  $on(eventName: string, handlerFn: any): void;
}

export interface IEvent {
  eventName: string;
  handlerFn(data: any): void;
}
