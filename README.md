# winston-logzio
A Winston transport wrapper for [Logz.io](http://logz.io/)

## Installation
```js
npm install winston-logzio --save-dev
```


## Sample usage
```javascript
var winston = require('winston');
var logzioWinstonTransport = require('winston-logzio');

var loggerOptions = {
    apiToken: '__YOUR_API_TOKEN__'
};
winston.add(logzioWinstonTransport, loggerOptions);

winston.log('info', 'winston logger configured with logzio transport');

```

Make sure you replace `__YOUR_API_TOKEN__` with your own logz.io api token.<br/>
If you do not have a [Logz.io](http://logz.io) account, you can sign up for a free trial [here](https://app.logz.io/#/signup)


## Details
This winston plugin, basically just wraps our [nodejs logzio shipper](https://github.com/logzio/logzio-nodejs).<br/>
If you want to configure the nodejs logger, any parameters sent to winston when initializing the transport
(what is held in the variable `loggerOptions` in the sample above) will be passed to the logzio nodejs logger itself.
