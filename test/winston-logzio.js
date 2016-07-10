var sinon  = require('sinon');
var assert = require('assert');
var logzioNodejs = require('logzio-nodejs');
var winston = require('winston');
var winstonLogzio = require('../lib/winston-logzio');

describe('winston-logzio', function() {

    describe('send string as log message', function () {
        var logSpy = sinon.spy();

        before(function(done){
            sinon.stub(logzioNodejs, 'createLogger')
                .returns({ log: logSpy });
            done();
        });

        after(function(done) {
            logzioNodejs.createLogger.restore();
            done();
        });

        it('builds the log object properly', function (done) {
            winston.add(winston.transports.Logzio, {
                name: 'logger1',
                token: '_API_TOKEN_'
            });
            var logMessage = 'Just a test message';
            var errorMessage = 'Big problem';
            winston.log('warn', logMessage, new Error(errorMessage));

            assert(logSpy.calledOnce);
            var loggedObject = logSpy.args[0][0];
            assert(loggedObject.message === logMessage);
            assert(loggedObject.level === 'warn');
            assert(typeof loggedObject.meta === 'object');
            assert(typeof loggedObject.meta.error === 'string');
            assert(loggedObject.meta.error.indexOf(errorMessage) >= 0);

            done();
        });
    });

});