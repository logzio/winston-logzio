const util = require('util');
const _assign = require('lodash.assign');
const winston = require('winston');
const Transport = require('winston-transport');
const {createLogger, transports, format} = winston;
const stringifySafe = require('json-stringify-safe');
const logzioNodejs = require('logzio-nodejs');


module.exports = class LogzioWinstonTransport extends Transport {
    constructor (options) {
        super(options);
        this.name = options.name || 'LogzioLogger';

        this.level = options.level || 'info';

        this.logzioLogger = logzioNodejs.createLogger(options);
    }


    static safeToString (json) {
        try {
            return JSON.stringify(json);
        }
        catch (ex) {
            return stringifySafe(json, null, null, function () {
            });
        }
    }

    log (info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });
        let meta = info[Symbol.for('splat')][0];
        if (meta instanceof Error) {
            meta = {error: meta.stack || meta.toString()};
        }
        const message = {
            meta,
            level: info.level,
            message: info.message
        };

        this.logzioLogger.log(message);

        callback(null, true);
    }

    finish (callback) {
        this.logzioLogger.sendAndClose(callback);
    }
};


