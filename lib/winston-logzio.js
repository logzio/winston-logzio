var util = require('util');
var winston = require('winston');
var stringifySafe = require('json-stringify-safe');
var logzioNodejs = require('logzio-nodejs');

exports = module.exports = winston.transports.Logzio = function (options) {

    this.name = options.name || 'LogzioLogger';

    this.level = options.level || 'info';

    this.logzioLogger = logzioNodejs.createLogger({
        token: options.apiToken,
        type: options.type     // OPTIONAL (If none is set, it will be 'nodejs')
    });
};
var Logzio = winston.transports.Logzio;

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(Logzio, winston.Transport);

Logzio.prototype.safeToString = function(json) {
    try {
        return JSON.stringify(json);
    }
    catch(ex) {
        return stringifySafe(json, null, null, function() { });
    }
};

Logzio.prototype.log = function (level, msg, meta, callback) {

    if (typeof msg !== 'string' && typeof msg !== 'object') {
        msg = {message: this.safeToString(msg)};
    }
    else if (typeof msg === 'string') {
        msg = {message: msg};
    }

    util._extend(msg, {
        level: level,
        meta: meta
    });

    this.logzioLogger.log(msg);

    callback(null, true);
};