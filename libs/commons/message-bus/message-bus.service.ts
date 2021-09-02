import { Injectable } from '@angular/core';
import {
  MessageBus as MessageBusCore,
  IMessageBus,
  IMessageBusConfig,
  IChannel,
} from '@claro/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageBus implements IMessageBus {
  private messageBus: IMessageBus;

  constructor() {
    this.createInstance();
  }

  emit(channel: string, topic: string, data: any, config?: IMessageBusConfig) {
    this.messageBus.emit(channel, topic, data, config);
    this.waitForChanges(channel);
  }

  on$(
    channel: string,
    topic: string,
    config?: IMessageBusConfig,
  ): Observable<any> {
    document.addEventListener(channel, () => {});
    return this.messageBus.on$(channel, topic, config);
  }

  getValue(channel: string, topic: string, config?: IMessageBusConfig) {
    return this.messageBus.getValue(channel, topic, config);
  }

  getValues(channel: string, topic: string, config?: IMessageBusConfig) {
    return this.messageBus.getValues(channel, topic, config);
  }

  getChannels(): IChannel {
    return this.messageBus.getChannels();
  }

  private createInstance() {
    if (this.existsMessageBusInstance()) {
      this.messageBus = (window as any).messageBus;
      return;
    }

    (window as any).messageBus = MessageBusCore.getInstance();
    this.messageBus = (window as any).messageBus;
  }

  private existsMessageBusInstance() {
    return !!(window as any).messageBus;
  }

  private waitForChanges(channel: string) {
    document.dispatchEvent(new CustomEvent(channel));
  }
}
