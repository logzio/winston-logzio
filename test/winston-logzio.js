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

  describe('send error as log message', () => {
    it('builds the log object properly with error', (done) => {
      const logzioWinstonTransport = new LogzioWinstonTransport({
        level: 'info',
        name: 'logger1',
        token: '_API_TOKEN_',
      });
      const logger = createLogger({
        format: format.combine(
          format.errors({
            stack: true,
          }),
        ),
        transports: [logzioWinstonTransport],
      });

      const errorMessage = 'Big problem';
      const error = new Error(errorMessage);
      logger.log('error', error);

      assert(logSpy.calledOnce);
      const loggedObject = logSpy.args[0][0];
      assert(loggedObject.level === 'error');
      assert(loggedObject.message === errorMessage);
      assert(typeof loggedObject.stack === 'string');

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
      const integerValue = 100;
      const testMessage = 'logzio';

      logger.log('info', 'Just a test message - %s %d', stringValue, integerValue, {
        test: testMessage,
      });

      assert(logSpy.calledOnce);
      const loggedObject = logSpy.args[0][0];
      assert(loggedObject.message === `${logMessage} - ${stringValue} ${integerValue}`);
      assert(loggedObject.level === 'info');
      assert(loggedObject.test === testMessage);

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
    it('build the log object using json formater', (done) => {
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
