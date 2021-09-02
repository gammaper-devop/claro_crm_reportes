import {
  Injectable,
  InjectionToken,
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { ILogger, ILoggerConfig, Logger as CoreLogger } from '@claro/core';
export { ELoggerLevels, ILogger, ILoggerConfig } from '@claro/core';

Injectable();
export class Logger extends CoreLogger {}

const LoggerConfig = new InjectionToken<ILoggerConfig>('loggerConfig');

export function factoryFnLogger(loggerConfig: ILoggerConfig): ILogger {
  return new Logger(loggerConfig);
}

@NgModule()
export class LoggerModule {
  static forRoot(loggerConfig: ILoggerConfig): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [
        {
          provide: LoggerConfig,
          useValue: loggerConfig
        },
        {
          provide: Logger,
          useFactory: factoryFnLogger,
          deps: [LoggerConfig]
        }
      ]
    };
  }
}
