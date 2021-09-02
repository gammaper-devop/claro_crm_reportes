import {
  IStorage,
  IStorageConfig,
  StorageFactory as storage,
} from '../storage';
import {
  CONSTANTS,
  IAuthentication,
  IMessages,
  IPasswordGrantResponse,
  TAuthConfig,
  TAuthRequest,
} from './global';
import * as messages from './global/i18n';

export abstract class AuthenticationManager implements IAuthentication {
  config: TAuthConfig;
  protected identity = {} as IPasswordGrantResponse;
  protected storage: IStorage;
  protected messages: IMessages;

  constructor(authConfig: TAuthConfig) {
    this.config = authConfig;
    switch (this.config.i18nLang) {
      case 'en_US':
        this.messages = messages.EN;
        break;
      default:
        this.messages = messages.ES;
        break;
    }
    if (!this.config.secretKey) {
      throw new TypeError(this.messages.secret_key_not_found);
    }
    const storageConfig: IStorageConfig = {
      secretKey: this.config.secretKey,
      storageType: this.config.storageType,
      i18nLang: this.config.i18nLang,
    };
    this.storage = storage(storageConfig);
    const identityStorage = this.getIdentity();
    if (identityStorage) {
      this.identity = identityStorage;
    }
  }

  async authenticate(authRequest: TAuthRequest): Promise<any> {
    return authRequest;
  }

  getToken(): string {
    return this.identity.access_token;
  }

  isAuthenticated(): boolean {
    return Object.keys(this.identity).length > 0;
  }

  isExpired(): boolean {
    if (this.identity && this.identity.expires_in) {
      return new Date().getTime() >= this.identity.expires_in;
    } else {
      return false;
    }
  }

  clean(): void {
    this.storage.remove(CONSTANTS.identityStorageKey);
    this.identity = {} as IPasswordGrantResponse;
  }

  protected setIdentity(identity: any) {
    this.identity = identity;
    if (
      this.identity.expires_in &&
      String(this.identity.expires_in).length < 10
    ) {
      this.identity.expires_in =
        1000 * parseInt(String(this.identity.expires_in), 10) +
        new Date().getTime();
    } else {
      this.identity.expires_in = new Date(
        String(this.identity.expires_in),
      ).getTime();
    }
    this.storage.set(CONSTANTS.identityStorageKey, this.identity);
  }

  protected getIdentity() {
    return this.storage.get(CONSTANTS.identityStorageKey);
  }
}
