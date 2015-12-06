# winston-logzio
a winston transport wrapper for logzio

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


## Details
This winston plugin, basically just wraps our [nodejs logzio shipper](https://github.com/logzio/logzio-nodejs).<br/>
If you want to configure the nodejs logger, any parameters sent to winston when initializing the transport
(what is held in the variable `loggerOptions` in the sample above) will be passed to the logzio nodejs logger itself.