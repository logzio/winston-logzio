![Build Status](https://travis-ci.org/logzio/winston-logzio.svg?branch=master)

# winston-logzio
A Winston transport wrapper for [Logz.io](http://logz.io/)

## Installation
```js
npm install winston-logzio --save
```


## Sample usage
```javascript
var winston = require('winston');
var logzioWinstonTransport = require('winston-logzio');

var loggerOptions = {
    token: '__YOUR_API_TOKEN__',
    host: 'listener.logz.io', // either listener.logz.io for US accounts or listener-eu.logz.io for EU Accounts
    type: 'YourLogType'     // OPTIONAL (If none is set, it will be 'nodejs')
};

const logzioWinstonTransport = new LogzioWinstonTransport({
  level: 'info',
  name: 'winston_logzio',
  token: '__YOUR_API_TOKEN__',
});


var logger = createLogger(winston.Logger)({
  transports: [logzioWinstonTransport],
  ]);

const logMessage = 'Just a test message';
const errorMessage = 'Big problem';
const error = new Error(errorMessage);
logger.log('warn', logMessage, error);

```

Make sure you replace `__YOUR_API_TOKEN__` with your own logz.io api token.<br/>

If you do not have a [Logz.io](http://logz.io) account, you can sign up for a free trial [here](https://app.logz.io/#/signup)


## Details
This winston plugin, basically just wraps our [nodejs logzio shipper](https://github.com/logzio/logzio-nodejs).<br/>
If you want to configure the nodejs logger, any parameters sent to winston when initializing the transport
(what is held in the variable `LogzioWinstonTransport` in the sample above) will be passed to the logzio nodejs logger itself.


## Logs in my console  
The winston logger by default sends all logs to the console.  
You can easily disable this by adding this line to your code :
```js
winston.remove(winston.transports.Console);
```
