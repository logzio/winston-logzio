import { ILoggerOptions } from "logzio-nodejs";
import Transport from "winston-transport";

declare namespace LogzioWinstonTransport {
  interface IWinstonLogzioLoggerOptions extends ILoggerOptions {
    name?: string;
    level?: string;
  }
}

declare class LogzioWinstonTransport extends Transport {
  constructor(options: LogzioWinstonTransport.IWinstonLogzioLoggerOptions);

  static safeToString(json: any): string;
}

export = LogzioWinstonTransport;
