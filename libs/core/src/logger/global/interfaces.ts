import { ELoggerLevels } from './enums';

export interface ILoggerConfig {
  level?: ELoggerLevels;
  secretKey?: string;
  serverLog?: {
    url: string;
    level?: ELoggerLevels;
  };
  customLog?: {
    method: (message: string, additional: any) => void;
    level?: ELoggerLevels;
  };
  i18nLang?: string;
}

export interface ILogger {
  /**
   *
   * @param headerName Nombre de la cabecera de autorización, valor por defecto: Authorization
   * @param tokenType Tipo de token de autorización, valor por defecto: Bearer
   * @param accessToken Valor del token de autorización
   */
  setHeader(accessToken: string, headerName?: string, tokenType?: string): void;

  /**
   *
   * @param messageToPrint Mensaje a imprimir
   * @param additionalInfo Información Adicional
   */
  info(messageToPrint: string, additionalInfo?: any): void;

  /**
   *
   * @param messageToPrint Mensaje a imprimir
   * @param additionalInfo Información Adicional
   */
  debug(messageToPrint: string, additionalInfo?: any): void;

  /**
   *
   * @param messageToPrint Mensaje a imprimir
   * @param additionalInfo Información Adicional
   */
  log(messageToPrint: string, additionalInfo?: any): void;

  /**
   *
   * @param messageToPrint Mensaje a imprimir
   * @param additionalInfo Información Adicional
   */
  trace(messageToPrint: string, additionalInfo?: any): void;

  /**
   *
   * @param messageToPrint Mensaje a imprimir
   * @param additionalInfo Información Adicional
   */
  warn(messageToPrint: string, additionalInfo?: any): void;

  /**
   *
   * @param messageToPrint Mensaje a imprimir
   * @param additionalInfo Información Adicional
   */
  error(messageToPrint: string, additionalInfo?: any): void;
}

export interface IMessages {
  secret_key_not_found: string;
  circular_object: string;
}
