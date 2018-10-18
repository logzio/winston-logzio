var util = require('util');
var _assign = require('lodash.assign');
var winston = require('winston');
var stringifySafe = require('json-stringify-safe');
var logzioNodejs = require('logzio-nodejs');

module.exports = module.exports = class LogzioWinstonTransport extends Transport {
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

        if (typeof info.message !== 'string' && typeof info.message !== 'object') {
            msg = {message: this.safeToString(info.message)};
        }
        else if (typeof msg === 'string') {
            msg = {message: info.message};
        }
        // todo - check
        if (meta = info[Symbol.for('splat')][0]) {
            if (meta instanceof Error) {
                meta = {error: meta.stack || meta.toString()};
            }
        }

        _assign(msg, {
            level: info.level,
            meta: meta
        });

        this.logzioLogger.log(msg);

        callback(null, true);
    }

    safeToString (json) {
        try {
            return JSON.stringify(json);
        }
        catch(ex) {
            return stringifySafe(json, null, null, function() { });
        }
    }

    finish (callback) {
        this.logzioLogger.sendAndClose(callback);
    }
};
