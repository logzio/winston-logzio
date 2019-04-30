const sinon = require('sinon');
const assert = require('assert');
const logzioNodejs = require('logzio-nodejs');
const winston = require('winston');

const {
  MESSAGE,
} = require('triple-beam');

const {
  createLogger,
  format,
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
        format: format.combine(
          format.splat(),
          format.simple(),
        ),
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
      assert(loggedObject.meta.message === errorMessage);
      assert(typeof loggedObject.meta.stack === 'string');

      done();
    });
  });

  describe('send a formated string as log message', () => {
    it('builds the log object using splat string', (done) => {
      const logzioWinstonTransport = new LogzioWinstonTransport({
        level: 'info',
        name: 'logger1',
        token: '_API_TOKEN_',
      });
      const logger = createLogger({
        format: format.combine(
          format.splat(),
          format.simple(),
        ),
        transports: [logzioWinstonTransport],
      });

      const logMessage = 'Just a test message';
      const stringValue = 'value';
      const integarValue = 100;
      const testMessage = 'logzio';

      logger.log('info', 'Just a test message - %s %d', stringValue, integarValue, {
        test: testMessage,
      });

      assert(logSpy.calledOnce);
      const loggedObject = logSpy.args[0][0];
      assert(loggedObject.message === `${logMessage} - ${stringValue} ${integarValue}`);
      assert(loggedObject.level === 'info');
      assert(loggedObject.meta.test === testMessage);

      done();
    });
  });

  describe('send json as log message - no message field', () => {
    it('builds the log object using json formater without message field', (done) => {
      const logzioWinstonTransport = new LogzioWinstonTransport({
        level: 'info',
        name: 'logger1',
        token: '_API_TOKEN_',
      });
      const logger = createLogger({
        format: format.json(),
        transports: [logzioWinstonTransport],
      });

      const logMessage = 'Just a test message';
      const testMessage = 'logzio';
      logger.log('info', {
        msg: logMessage,
        test: testMessage,
      });

      assert(logSpy.calledOnce);
      const loggedObject = logSpy.args[0][0];

      assert(loggedObject.msg === logMessage);
      assert(loggedObject.test === testMessage);
      assert(loggedObject.level === 'info');
      assert(loggedObject[MESSAGE] === loggedObject.message);

      done();
    });
  });

  describe('send json as log message', () => {
    it('bbuilds the log object using json formater', (done) => {
      const logzioWinstonTransport = new LogzioWinstonTransport({
        level: 'info',
        name: 'logger1',
        token: '_API_TOKEN_',
      });
      const logger = createLogger({
        format: format.json(),
        transports: [logzioWinstonTransport],
      });

      const logMessage = 'Just a test message';
      const testMessage = 'logzio';
      logger.log('info', {
        message: logMessage,
        test: testMessage,
      });

      assert(logSpy.calledOnce);
      const loggedObject = logSpy.args[0][0];

      assert(loggedObject.message === logMessage);
      assert(loggedObject.test === testMessage);
      assert(loggedObject.level === 'info');

      done();
    });
  });
});
