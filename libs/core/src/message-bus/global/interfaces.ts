import { Observable, ReplaySubject } from 'rxjs';

export interface IChannel {
  [name: string]: ITopic;
}

export interface ITopic {
  [name: string]: {
    subject: ReplaySubject<any>;
    messages: any[];
    storedMessages: any[];
    checkedStorage: boolean;
  };
}

export interface IMessageBus {
  emit(
    channel: string,
    topic: string,
    data: any,
    config?: IMessageBusConfig,
  ): void;
  on$(
    channel: string,
    topic: string,
    config?: IMessageBusConfig,
  ): Observable<any>;
  getValue(channel: string, topic: string, config?: IMessageBusConfig): any;
  getValues(channel: string, topic: string, config?: IMessageBusConfig): any[];
  getChannels(): IChannel;
}

export interface IMessageBusConfig {
  persist: boolean;
}
