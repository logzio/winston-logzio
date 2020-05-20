![Build Status](https://travis-ci.org/logzio/winston-logzio.svg?branch=master)

# winston-logzio
winston-logzio is a winston plugin and wrapper for the logzio-nodejs appender. With winston-logzio, you can take advantage of the winston logger framework with your Node.js app.

### Versions
Supports Winston 3, If you want to use Winston 2 - Checkout v1.0.8

### Add the dependency to your project
```bash
npm install winston-logzio --save
```

## Configure winston-logzio
Use the samples in the code block below as a starting point, and replace the sample with a configuration that matches your needs.  
To run with **Typescript** [click here](#typescript).
 
```javascript
const winston = require('winston');
const LogzioWinstonTransport = require('winston-logzio');

const logzioWinstonTransport = new LogzioWinstonTransport({
  level: 'info',
  name: 'winston_logzio',
  token: '<<SHIPPING-TOKEN>>',
  host: '<<LISTENER-HOST>>',
});


const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [logzioWinstonTransport],
});

logger.log('warn', 'Just a test message');
```
Replace `<<SHIPPING-TOKEN>>` with your own logz.io logs shipping [token](https://app.logz.io/#/dashboard/settings/general).<br/>
Replace `<<LISTENER-HOST>>` with your [region’s listener host](https://docs.logz.io/user-guide/accounts/account-region.html) (for example, listener.logz.io). </br>   
For more parameters for LogzioWinstonTransport and configuration options see our [docs](https://deploy-preview-503--logz-docs.netlify.app/shipping/log-sources/nodejs.html#parameters-1). </br>
If you do not have a [Logz.io](http://logz.io) account, you can sign up for a free trial [here](https://app.logz.io/#/signup)

### Details
This winston plugin, basically just wraps our [nodejs logzio shipper](https://github.com/logzio/logzio-nodejs).<br/>
If you want to configure the nodejs logger, any parameters sent to winston when initializing the transport
(what is held in the variable `LogzioWinstonTransport` in the sample above) will be passed to the logzio nodejs logger itself.


### Logs in my console  
The winston logger by default sends all logs to the console.  
You can easily disable this by adding this line to your code :
```js
winston.remove(winston.transports.Console);
```

<div id="typescript">

## Running with Typescript

If you don't have a 'tsconfig.json' file start by running:
  
  ```
  tsc --init
  ```
  On your 'tsconfig' file, under 'compilerOptions' make sure you have 'esModuleInterop' flag with the value 'true' or add it this way:
``` 
  "compilerOptions": {
    ...
    "esModuleInterop": true
  }
```
Code sample:
```
import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';

const logzioWinstonTransport = new LogzioWinstonTransport({
  level: 'info',
  name: 'winston_logzio',
   token: '<<SHIPPING-TOKEN>>',
  host: '<<LISTENER-HOST>>',
});


const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [logzioWinstonTransport],
});

logger.log('warn', 'Just a test message');
```

Replace `<<SHIPPING-TOKEN>>` with your own logz.io logs shipping [token](https://app.logz.io/#/dashboard/settings/general).<br/>
Replace `<<LISTENER-HOST>>` with your [region’s listener host](https://docs.logz.io/user-guide/accounts/account-region.html) (for example, listener.logz.io). </br>

For more parameters for LogzioWinstonTransport and configuration options see our [docs](https://deploy-preview-503--logz-docs.netlify.app/shipping/log-sources/nodejs.html#parameters-1).</br>
For trouble shooting press [here](#trouble-shooting).</br>
If you do not have a [Logz.io](http://logz.io) account, you can sign up for a free trial [here](https://app.logz.io/#/signup).


**Note:** If winston-logzio is used as part of a serverless service (AWS Lambda, Azure Functions, Google Cloud Functions, etc.), add `logger.close()` at the end of the run.

### Details
This winston plugin, basically just wraps our [nodejs logzio shipper](https://github.com/logzio/logzio-nodejs).<br/>
If you want to configure the nodejs logger, any parameters sent to winston when initializing the transport
(what is held in the variable `LogzioWinstonTransport` in the sample above) will be passed to the logzio nodejs logger itself.


### Logs in my console  
The winston logger by default sends all logs to the console.  
You can easily disable this by adding this line to your code :
```js
winston.remove(winston.transports.Console);
```
<div id="trouble-shooting">

# Trouble shooting

To fix errors related to "esModuleInterop" flag make sure you run the relavent 'tsconfig' file.
These might help:
```
tsc <file-name>.ts --esModuleInterop
```
or
```
tsc --project tsconfig.json  
```
</div>

</div>
