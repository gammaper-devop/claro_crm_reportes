import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { IStorage, StorageFactory as storage } from '../storage';
import {
  CONSTANTS,
  IChannel,
  IMessageBus,
  IMessageBusConfig,
  ITopic,
} from './global';

import { customEvent } from './polyfill';
customEvent();

export class MessageBus implements IMessageBus {
  private static window = window as any;
  private channels: IChannel = {};
  private storage = {} as IStorage;

  constructor() {
    this.storage = storage({
      secretKey: CONSTANTS.storageSecretKey,
    });
  }

  static getInstance(): MessageBus {
    if (!this.window.messagebus) {
      this.window.messagebus = new MessageBus();
    }

    return this.window.messagebus;
  }

  emit(
    channel: string,
    topic: string,
    data: any,
    config: IMessageBusConfig = CONSTANTS.defaultConfig,
  ): void {
    this.validateChannel(channel, topic, config.persist);
    this.checkStorage(channel, topic);
    this.setMessage(channel, topic, data);

    if (config.persist) {
      this.channels[channel][topic].storedMessages.push(data);
      this.storage.set(
        channel + CONSTANTS.separator + topic,
        this.channels[channel][topic].storedMessages,
      );
    }
  }

  on$(
    channel: string,
    topic: string,
    config: IMessageBusConfig = CONSTANTS.defaultConfig,
  ): Observable<any> {
    this.validateChannel(channel, topic, config.persist);
    this.checkStorage(channel, topic);

    return this.channels[channel][topic].subject.asObservable();
  }

  getValue(
    channel: string,
    topic: string,
    config: IMessageBusConfig = CONSTANTS.defaultConfig,
  ): any {
    this.validateChannel(channel, topic, config.persist);

    return this.channels[channel][topic].messages.slice(-1)[0];
  }

  getValues(
    channel: string,
    topic: string,
    config: IMessageBusConfig = CONSTANTS.defaultConfig,
  ): any[] {
    this.validateChannel(channel, topic, config.persist);

    return this.channels[channel][topic].messages;
  }

  getChannels(): IChannel {
    return this.channels;
  }

  private validateChannel(
    channel: string,
    topic: string,
    checkedStorage: boolean = false,
  ) {
    if (!this.channels[channel] || !this.channels[channel][topic]) {
      const topicObj: ITopic = {};
      topicObj[topic] = {
        subject: new ReplaySubject<any>(),
        messages: [],
        storedMessages: [],
        checkedStorage,
      };
      this.channels[channel] = {
        ...this.channels[channel],
        ...topicObj,
      };
    }
  }

  private checkStorage(channel: string, topic: string) {
    if (!this.channels[channel][topic].checkedStorage) {
      this.channels[channel][topic].checkedStorage = true;
      const messages: any[] = this.storage.get(
        channel + CONSTANTS.separator + topic,
      );
      if (messages && messages.length) {
        messages.forEach(data => {
          this.setMessage(channel, topic, data);
        });
        this.channels[channel][topic].storedMessages = messages;
      }
    }
  }

  private setMessage(channel: string, topic: string, data: any) {
    this.channels[channel][topic].subject.next(data);
    this.channels[channel][topic].messages.push(data);
  }
}
