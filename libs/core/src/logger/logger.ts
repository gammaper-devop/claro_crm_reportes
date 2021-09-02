import {
  IStorage,
  IStorageConfig,
  StorageFactory as storage,
} from '../storage';
import {
  CONSTANTS,
  ELoggerLevels,
  ILogger,
  ILoggerConfig,
  IMessages,
  UTILS,
} from './global';
import * as messages from './global/i18n';

export class Logger implements ILogger {
  protected storage = {} as IStorage;
  private headers: any = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  private messages: IMessages;

  constructor(private config: ILoggerConfig) {
    this.config.level =
      config.level !== undefined ? config.level : ELoggerLevels.OFF;
    this.config.i18nLang = config.i18nLang || CONSTANTS.i18nLang;
    switch (this.config.i18nLang) {
      case 'en_US':
        this.messages = messages.EN;
        break;
      default:
        this.messages = messages.ES;
        break;
    }
    if (this.config.serverLog && this.config.serverLog.url) {
      if (!this.config.secretKey) {
        throw new TypeError(this.messages.secret_key_not_found);
      }
      const storageConfig: IStorageConfig = {
        secretKey: this.config.secretKey || '',
        i18nLang: this.config.i18nLang,
      };
      this.storage = storage(storageConfig);
      const headersStorage = this.getHeaders();
      if (headersStorage) {
        this.headers = headersStorage;
      }
    }
  }

  setHeader(
    accessToken: string,
    headerName = CONSTANTS.headerName,
    tokenType = CONSTANTS.tokenType,
  ): void {
    this.headers[headerName] = tokenType + ' ' + accessToken;
    if (this.config.serverLog && this.config.serverLog.url) {
      this.storage.set(CONSTANTS.headersStorageKey, this.headers);
    }
  }

  trace(message: string, additionalInfo: any = ''): void {
    this._log(ELoggerLevels.TRACE, message, additionalInfo);
  }

  debug(message: string, additionalInfo: any = ''): void {
    this._log(ELoggerLevels.DEBUG, message, additionalInfo);
  }

  info(message: string, additionalInfo: any = ''): void {
    this._log(ELoggerLevels.INFO, message, additionalInfo);
  }

  log(message: string, additionalInfo: any = ''): void {
    this._log(ELoggerLevels.LOG, message, additionalInfo);
  }

  warn(message: string, additionalInfo: any = ''): void {
    this._log(ELoggerLevels.WARN, message, additionalInfo);
  }

  error(message: string, additionalInfo: any = ''): void {
    this._log(ELoggerLevels.ERROR, message, additionalInfo);
  }

  protected getHeaders() {
    return this.storage.get(CONSTANTS.headersStorageKey);
  }

  private _log(
    logLevel: ELoggerLevels,
    messageToPrint: string,
    additional: any,
  ): void {
    if (!messageToPrint) {
      return;
    }

    if (logLevel < this.config.level!) {
      return;
    }

    this._serverLog(logLevel, messageToPrint, additional);

    this._customLog(logLevel, messageToPrint, additional);

    if (typeof messageToPrint === 'object') {
      try {
        // tslint:disable-next-line:no-parameter-reassignment
        messageToPrint = JSON.stringify(messageToPrint, null, 2);
      } catch (e) {
        // tslint:disable-next-line:no-parameter-reassignment
        additional = [messageToPrint, ...additional];
        // tslint:disable-next-line:no-parameter-reassignment
        messageToPrint = this.messages.circular_object;
      }
    }

    if (UTILS.isIExplorer()) {
      return this.logIExplorer(logLevel, messageToPrint, additional);
    }

    // tslint:disable-next-line:no-console
    console.log(
      `%c${UTILS.getTimestamp()} [${CONSTANTS.logLevels[logLevel]}]`,
      `color:${this.getColorMessage(logLevel)}`,
      messageToPrint,
      ...additional,
    );
  }

  /**
   * Método para enviar una incidencia a un endpoint
   * de un servidor proporcionado por el usuario
   */
  private _serverLog(
    level: ELoggerLevels,
    message: string,
    additional: any,
  ): void {
    if (!this.config.serverLog || !this.config.serverLog.url) {
      return;
    }

    this.config.serverLog.level =
      this.config.serverLog.level !== undefined
        ? this.config.serverLog.level
        : this.config.level;

    if (level < this.config.serverLog.level!) {
      return;
    }

    fetch(this.config.serverLog.url, {
      method: 'POST',
      body: JSON.stringify({ message, additional }),
      headers: this.headers,
    });
  }

  /**
   * Método para enviar una incidencia
   * a una funcionalidad personalizada por el usuario
   */
  private _customLog(
    level: ELoggerLevels,
    message: string,
    additional: any,
  ): void {
    if (!this.config.customLog || !this.config.customLog.method) {
      return;
    }

    this.config.customLog.level =
      this.config.customLog.level !== undefined
        ? this.config.customLog.level
        : this.config.level;

    if (level < this.config.customLog.level!) {
      return;
    }

    this.config.customLog.method(message, additional);
  }

  private logIExplorer = (
    logLevel: ELoggerLevels,
    message: string,
    additional: any,
  ) => {
    switch (logLevel) {
      case ELoggerLevels.WARN:
        // tslint:disable-next-line:no-console
        console.warn(
          `${UTILS.getTimestamp()} [${CONSTANTS.logLevels[logLevel]}] `,
          message,
          ...additional,
        );
        break;
      case ELoggerLevels.ERROR:
        // tslint:disable-next-line:no-console
        console.error(
          `${UTILS.getTimestamp()} [${CONSTANTS.logLevels[logLevel]}] `,
          message,
          ...additional,
        );
        break;
      case ELoggerLevels.INFO:
        // tslint:disable-next-line:no-console
        console.info(
          `${UTILS.getTimestamp()} [${CONSTANTS.logLevels[logLevel]}] `,
          message,
          ...additional,
        );
        break;
      default:
        // tslint:disable-next-line:no-console
        console.log(
          `${UTILS.getTimestamp()} [${CONSTANTS.logLevels[logLevel]}] `,
          message,
          ...additional,
        );
    }
  };

  private getColorMessage = (logLevel: ELoggerLevels) => {
    switch (logLevel) {
      case ELoggerLevels.TRACE:
        return 'lightskyblue';
      case ELoggerLevels.DEBUG:
        return 'darkseagreen';
      case ELoggerLevels.INFO:
        return 'powderblue';
      case ELoggerLevels.LOG:
        return 'lightgrey';
      case ELoggerLevels.WARN:
        return 'moccasin';
      case ELoggerLevels.ERROR:
        return 'lightpink';
      case ELoggerLevels.OFF:
      default:
        return undefined;
    }
  };
}
