![Build Status](https://travis-ci.org/logzio/winston-logzio.svg?branch=master)

# winston-logzio
A Winston transport wrapper for [Logz.io](http://logz.io/)
## Versions
Supports Winston 3, If you want to use Winston 2 - Checkout v1.0.8

## Installation
```bash
npm install winston-logzio --save
```


## Sample usage
```javascript
const winston = require('winston');
const LogzioWinstonTransport = require('winston-logzio');

const logzioWinstonTransport = new LogzioWinstonTransport({
  level: 'info',
  name: 'winston_logzio',
  token: '__YOUR_API_TOKEN__',
});


const logger = winston.createLogger({
    transports: [logzioWinstonTransport]
});

logger.log('warn', 'Just a test message', new Error('Big problem'));
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
