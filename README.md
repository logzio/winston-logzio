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
For more parameters for LogzioWinstonTransport and configuration options see our [docs](https://docs.logz.io/shipping/log-sources/nodejs.html). </br>
If you do not have a [Logz.io](http://logz.io) account, you can sign up for a free trial [here](https://app.logz.io/#/signup)

## Options

-   **token**
    Mandatory. Your account token. Look it up in the Device Config tab in Logz.io
-   **type** - Log type. Help classify logs into different classifications
-   **protocol** - `http`, `https` or `udp`. Default: `http`
-   **host** - Destination host name. Default: `listener.logz.io`
-   **port** - Destination port. Default port depends on protocol. For `udp` default port is `5050`, for `http` is `8070` and `8071` is for `https`
-   **sendIntervalMs** - Time in milliseconds to wait between retry attempts. Default: `2000` (2 sec)
-   **bufferSize** - The maximum number of messages the logger will accumulate before sending them all as a bulk. Default: `100`.
-   **numberOfRetries** - The maximum number of retry attempts. Default: `3`
-   **debug** - Should the logger print debug messages to the console? Default: `false`
-   **callback** - A callback function called when an unrecoverable error has occured in the logger. The function API is: function(err) - err being the Error object.
-   **timeout** - The read/write/connection timeout in milliseconds.
-   **addTimestampWithNanoSecs** - Add a timestamp with nano seconds granularity. This is needed when many logs are sent in the same millisecond, so you can properly order the logs in kibana. The added timestamp field will be `@timestamp_nano` Default: `false`
- **addOtelContext** - Add `trace_id`, `span_id`, `service_name` fields to logs when opentelemetry context is available.  Default: `true`
-   **compress** - If true the the logs are compressed in gzip format. Default: `false`
-   **internalLogger** - set internal logger that supports the function log. Default: console.
-   **setUserAgent** - Set to `false` to send logs without the user-agent field in the request header. Default:`true`. If you want to send data from Firefox browser, set that option to `false`.
-   **extraFields** - Adds your own custom fields to each log. Add in JSON Format, for example: `extraFields : { field_1: "val_1", field_2: "val_2" , ... }`.

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
Replace `<<LISTENER-HOST>>` with your [region’s listener host](https://docs.logz.io/user-guide/accounts/account-region.html) (for example, listener.logz.io). <br/>

For more parameters for LogzioWinstonTransport and configuration options see our [docs](https://docs.logz.io/shipping/log-sources/nodejs.html).<br/>
For trouble shooting press [here](#trouble-shooting).<br/>
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

# Troubleshooting

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

## Add opentelemetry context
If you're sending traces with OpenTelemetry instrumentation (auto or manual), you can correlate your logs with the trace context. That way, your logs will have traces data in it, such as service name, span id and trace id (version >= `5.2.0`). 

This feature is enabled by default, To disable it, set the `AddOtelContext` param in your handler configuration to `false`, like in this example:

```javascript
const winston = require('winston');
const LogzioWinstonTransport = require('winston-logzio');

const logzioWinstonTransport = new LogzioWinstonTransport({
    level: 'info',
    name: 'winston_logzio',
    token: '<<SHIPPING-TOKEN>>',
    host: '<<LISTENER-HOST>>',
    addOtelCotext: false,
});

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [logzioWinstonTransport],
});
```

## Build and test locally
1. Clone the repository:
  ```bash
  git clone https://github.com/logzio/winston-logzio.git
  cd winston-logzio
  ```
2. Build and run tests:
  ```bash
  npm install
  npm test
