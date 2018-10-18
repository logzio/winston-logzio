const _assign = require('lodash.assign');
const winston = require('winston');
const Transport = require('winston-transport');
const {
    createLogger,
    transports,
    format
} = winston;
const stringifySafe = require('json-stringify-safe');
const logzioNodejs = require('logzio-nodejs');

module.exports = class LogzioWinstonTransport extends Transport {
    constructor (options) {
        super(options);
        this.name = options.name || 'LogzioLogger';
        this.level = options.level || 'info';
        this.logzioLogger = logzioNodejs.createLogger(options);
    }

    log (info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        let msg = info.message;
        if (typeof info.message !== 'string' && typeof info.message !== 'object') {
            msg = {
                message: this.safeToString(info.message)
            };
        } else if (typeof info.message === 'string') {
            msg = {
                message: info.message
            };
        }

        const splat = info[Symbol.for('splat')];
        let meta = splat && splat[0];
        if (meta instanceof Error) {
            meta = {
                error: meta.stack || meta.toString()
            };
        }

        const message = Object.assign({}, info, msg, {
            level: info.level || this.level,
            meta: meta
        });

        this.logzioLogger.log(message);
        callback(null, true);
    }

    safeToString (json) {
        try {
            return JSON.stringify(json);
        } catch (ex) {
            return stringifySafe(json, null, null, function () {});
        }
    }

    finish (callback) {
        this.logzioLogger.sendAndClose(callback);
    }
};
