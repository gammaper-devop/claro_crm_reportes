import { BrowserEncryptor } from './browser.encryptor';
import { TrafficEncryptor } from './traffic.encryptor';

export const encryptors: { [key: string]: any } = {
  browser: BrowserEncryptor,
  traffic: TrafficEncryptor,
};
