const sinon  = require('sinon');
const assert = require('assert');
const logzioNodejs = require('logzio-nodejs');
const winston = require('winston');
const {createLogger} = winston;
const LogzioWinstonTransport = require('../lib/winston-logzio');

describe('winston-logzio', function() {

    describe('send string as log message', function () {
        const logSpy = sinon.spy();

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
            const logzioWinstonTransport = new LogzioWinstonTransport({
                level: 'info',
                name: 'logger1',
                token: '_API_TOKEN_'
            });
            const logger = createLogger({
                transports: [logzioWinstonTransport],

            });

            const logMessage = 'Just a test message';
            const errorMessage = 'Big problem';
            const error = new Error(errorMessage);
            logger.log('warn', logMessage, error);

            assert(logSpy.calledOnce);
            const loggedObject = logSpy.args[0][0];
            assert(loggedObject.message === logMessage);
            assert(loggedObject.level === 'warn');
            assert(typeof loggedObject.meta === 'object');
                assert(typeof loggedObject.meta.error === 'string');
            assert(loggedObject.meta.error.indexOf(errorMessage) >= 0);

            done();
        });
    });

});
