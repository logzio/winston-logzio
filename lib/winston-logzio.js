const util = require('util');
const _assign = require('lodash.assign');
const winston = require('winston');
const Transport = require('winston-transport');
const { createLogger, transports, format } = winston;
const stringifySafe = require('json-stringify-safe');
const logzioNodejs = require('logzio-nodejs');



module.exports = class LogzioWinstonTransport extends Transport {
    constructor(opts) {
        super(opts);
        this.name = options.name || 'LogzioLogger';

        this.level = options.level || 'info';

        this.logzioLogger = logzioNodejs.createLogger(options);
    }


    static safeToString(json) {
        try {
            return JSON.stringify(json);
        }
        catch(ex) {
            return stringifySafe(json, null, null, function() { });
        }
    }

    // log(info, callback) {
    log(level, msg, meta, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        if (typeof msg !== 'string' && typeof msg !== 'object') {
            msg = {message: LogzioWinstonTransport.safeToString(msg)};
        }
        else if (typeof msg === 'string') {
            msg = {message: msg};
        }

        if (meta instanceof Error) {
            meta = winston.exceptions.getAllInfo(meta);
        }

        _assign(msg, {
            level: level,
            meta: meta
        });

        this.logzioLogger.log(msg);

        callback(null, true);
    }

    flush (callback) {
        this.logzioLogger.sendAndClose( callback );
    }
};


