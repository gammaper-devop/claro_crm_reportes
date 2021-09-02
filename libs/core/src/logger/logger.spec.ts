import { ELoggerLevels, ILoggerConfig, Logger, UTILS } from './';

let _localLoggerLevel;
let logger;

describe('logger', () => {
  beforeEach(() => {
    _localLoggerLevel = ELoggerLevels.DEBUG;

    let defaultOptions: ILoggerConfig = {
      secretKey: String(Math.log(1000)),
      level: _localLoggerLevel,
      i18nLang: 'en_US',
    };

    logger = new Logger(defaultOptions);
  });

  it('chequeando instancia logger', () => {
    expect(logger instanceof Logger).toBeTruthy();
  });

  it('retorna color', () => {
    let trace = logger._getColorMessage(ELoggerLevels.TRACE);
    let debug = logger._getColorMessage(ELoggerLevels.DEBUG);
    let info = logger._getColorMessage(ELoggerLevels.INFO);
    let log = logger._getColorMessage(ELoggerLevels.LOG);
    let error = logger._getColorMessage(ELoggerLevels.ERROR);
    let warn = logger._getColorMessage(ELoggerLevels.WARN);
    let off = logger._getColorMessage(ELoggerLevels.OFF);

    expect(trace).toEqual('lightskyblue');
    expect(debug).toEqual('darkseagreen');
    expect(info).toEqual('powderblue');
    expect(log).toEqual('lightgrey');
    expect(warn).toEqual('moccasin');
    expect(error).toEqual('lightpink');
    expect(off).toBeFalsy();
  });

  it('escribe log', () => {
    let console_log = spyOn(console, 'log');
    logger._log(_localLoggerLevel, 'message');
    expect(console_log).toHaveBeenCalled();
  });

  it('verifica mensaje vacio', () => {
    let console_log = spyOn(console, 'log');
    logger._log(_localLoggerLevel, null);
    expect(console_log).not.toHaveBeenCalled();
  });

  it('evalua nivel inferior de log al declarado en el constructor', () => {
    let console_log = spyOn(console, 'log');
    logger._log(ELoggerLevels.TRACE, 'message');
    expect(console_log).not.toHaveBeenCalled();
  });

  it('evalua si el mensaje es un objeto', () => {
    let console_log = spyOn(console, 'log');
    let message = {};

    logger._log(_localLoggerLevel, { message: 'message' });
    expect(console_log).toHaveBeenCalled();

    message = {};
    logger._log(_localLoggerLevel, message);

    expect(console_log).toHaveBeenCalled();
  });

  it('evalua si es internet explorer', () => {
    let logger_ie = spyOn(logger, '_logIExplorer');
    logger._log(_localLoggerLevel, 'message');
    expect(logger_ie).not.toHaveBeenCalled();

    UTILS.isIExplorer = () => true;

    logger._log(ELoggerLevels.WARN, 'message');
    expect(logger_ie).toHaveBeenCalled();

    logger._log(ELoggerLevels.ERROR, 'message');
    expect(logger_ie).toHaveBeenCalled();

    logger._log(ELoggerLevels.INFO, 'message');
    expect(logger_ie).toHaveBeenCalled();
  });

  it('loggea trace', () => {
    let _log = spyOn(logger, '_log');
    logger.trace('message');

    expect(_log).toHaveBeenCalled();
  });

  it('loggea debug', () => {
    let _log = spyOn(logger, '_log');
    logger.debug('message');

    expect(_log).toHaveBeenCalled();
  });

  it('loggea info', () => {
    let _log = spyOn(logger, '_log');
    logger.info('message');

    expect(_log).toHaveBeenCalled();
  });

  it('loggea log', () => {
    let _log = spyOn(logger, '_log');
    logger.log('message');

    expect(_log).toHaveBeenCalled();
  });

  it('loggea warn', () => {
    let _log = spyOn(logger, '_log');
    logger.warn('message');

    expect(_log).toHaveBeenCalled();
  });

  it('loggea error', () => {
    let _log = spyOn(logger, '_log');
    logger.error('message');

    expect(_log).toHaveBeenCalled();
  });

  it('debe retornar fecha valida', () => {
    let date = UTILS.getTimestamp();
    let valid = new Date(date).getTime() > 0;

    expect(valid).toBeTruthy();
  });
});
