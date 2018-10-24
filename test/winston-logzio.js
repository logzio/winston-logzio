const sinon = require('sinon');
const assert = require('assert');
const logzioNodejs = require('logzio-nodejs');
const winston = require('winston');

const {
  createLogger,
} = winston;
const LogzioWinstonTransport = require('../lib/winston-logzio');

describe('winston-logzio', () => {
  let logSpy;
  beforeEach((done) => {
    logSpy = sinon.spy();
    sinon.stub(logzioNodejs, 'createLogger')
      .returns({
        log: logSpy,
      });
    done();
  });

  afterEach((done) => {
    logzioNodejs.createLogger.restore();
    done();
  });

  describe('send string as log message', () => {
    it('builds the log object properly', (done) => {
      const logzioWinstonTransport = new LogzioWinstonTransport({
        level: 'info',
        name: 'logger1',
        token: '_API_TOKEN_',
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

  describe('send json as log message', () => {
    it('builds the log object as json properly', (done) => {
      const logzioWinstonTransport = new LogzioWinstonTransport({
        level: 'info',
        name: 'logger1',
        token: '_API_TOKEN_',
      });
      const logger = createLogger({
        transports: [logzioWinstonTransport],
      });

      const logMessage = {
        message: 'Just a test message',
        string_value: 'value',
        integar_value: 100,
      };
      const errorMessage = 'Big problem';
      const error = new Error(errorMessage);
      logger.log('warn', logMessage, error);

      assert(logSpy.calledOnce);
      const loggedObject = logSpy.args[0][0];
      assert(loggedObject.message === logMessage.message);
      assert(loggedObject.string_value === logMessage.string_value);
      assert(loggedObject.integer_value === logMessage.integer_value);
      assert(loggedObject.level === 'warn');
      assert(typeof loggedObject.meta === 'object');
      assert(typeof loggedObject.meta.error === 'string');
      assert(loggedObject.meta.error.indexOf(errorMessage) >= 0);

      done();
    });
  });

  describe('send json as log message without error', () => {
    it('builds the log object with just a message object', (done) => {
      const logzioWinstonTransport = new LogzioWinstonTransport({
        level: 'info',
        name: 'logger1',
        token: '_API_TOKEN_',
      });
      const logger = createLogger({
        transports: [logzioWinstonTransport],
      });

      const logMessage = {
        message: 'Just a test message',
        string_value: 'value',
        integar_value: 100,
      };
      logger.log('warn', logMessage);

      assert(logSpy.calledOnce);
      const loggedObject = logSpy.args[0][0];

      assert(loggedObject.message === logMessage.message);
      assert(loggedObject.string_value === logMessage.string_value);
      assert(loggedObject.integer_value === logMessage.integer_value);
      assert(loggedObject.level === 'warn');
      done();
    });
  });
});
