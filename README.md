[![Run Tests](https://github.com/logzio/winston-logzio/actions/workflows/test.yml/badge.svg)](https://github.com/logzio/winston-logzio/actions/workflows/test.yml)

# winston-logzio

winston-logzio is a winston plugin and wrapper for the logzio-nodejs appender. With winston-logzio, you can take advantage of the winston logger framework with your Node.js app.

### Versions

Supports Winston 3. If you want to use Winston 2, check out v1.0.8.

Requires Node.js `^18.19.0 || >=20.6.0` (required by the OpenTelemetry packages used by [logzio-nodejs](https://github.com/logzio/logzio-nodejs)).

### Add the dependency to your project

```bash
npm install winston-logzio --save
```

## Configure winston-logzio

Use the samples in the code block below as a starting point, and replace the sample with a configuration that matches your needs.
To run with **TypeScript** [click here](#running-with-typescript).

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
Replace `<<LISTENER-HOST>>` with your [region’s listener host](https://docs.logz.io/user-guide/accounts/account-region.html) (for example, listener.logz.io).<br/>
For more parameters for LogzioWinstonTransport and configuration options see our [docs](https://docs.logz.io/shipping/log-sources/nodejs.html).<br/>
If you do not have a [Logz.io](http://logz.io) account, you can sign up for a free trial [here](https://app.logz.io/#/signup).

**Note:** If winston-logzio is used as part of a serverless service (AWS Lambda, Azure Functions, Google Cloud Functions, etc.), add `logger.close()` at the end of the run so buffered logs are sent before the process exits.

## Options

Transport options:

-   **name** - Name of the transport, added to each log as the `name` field. Default: `LogzioLogger`
-   **level** - Minimum winston log level this transport sends. Default: `info`

Shipping options (passed to [logzio-nodejs](https://github.com/logzio/logzio-nodejs)):

-   **token** - Mandatory. Your account token. Look it up in the Device Config tab in Logz.io
-   **type** - Log type. Helps classify logs into different classifications. Default: `nodejs`
-   **protocol** - `http`, `https` or `udp`. Default: `http`
-   **host** - Destination host name. Default: `listener.logz.io`
-   **port** - Destination port. Default port depends on protocol: `5050` for `udp`, `8070` for `http` and `8071` for `https`
-   **sendIntervalMs** - Time in milliseconds between sending bulks of buffered logs. Default: `10000` (10 sec)
-   **bufferSize** - The maximum number of messages the logger will accumulate before sending them all as a bulk. Default: `100`
-   **numberOfRetries** - The maximum number of retry attempts. Default: `3`
-   **sleepUntilNextRetry** - Time in milliseconds to wait between retry attempts. Default: `2000` (2 sec)
-   **timeout** - The read/write/connection timeout in milliseconds.
-   **debug** - Should the logger print debug messages to the console? Default: `false`
-   **callback** - A function called after each bulk is sent: `callback()` on success, `callback(err, bulk)` on failure. By default, errors are printed with the `internalLogger`.
-   **supressErrors** - Set to `true` to stop the default callback from printing errors. Default: `false`
-   **internalLogger** - Set an internal logger that supports the function `log`. Default: `console`
-   **addTimestampWithNanoSecs** - Add a timestamp with nanosecond granularity. This is needed when many logs are sent in the same millisecond, so you can properly order the logs in Kibana. The added timestamp field will be `@timestamp_nano`. Default: `false`
-   **addOtelContext** - Add `trace_id`, `span_id`, `service_name` fields to logs when OpenTelemetry context is available. See [Add OpenTelemetry context](#add-opentelemetry-context). Default: `true`
-   **compress** - If `true`, the logs are compressed in gzip format. Default: `false`
-   **extraFields** - Adds your own custom fields to each log. Add in JSON format, for example: `extraFields : { field_1: "val_1", field_2: "val_2" , ... }`

### Details

This winston plugin basically just wraps our [nodejs logzio shipper](https://github.com/logzio/logzio-nodejs).<br/>
If you want to configure the nodejs logger, any parameters sent to winston when initializing the transport
(what is held in the variable `LogzioWinstonTransport` in the sample above) will be passed to the logzio nodejs logger itself.

### Logs in my console

In Winston 3, `winston.createLogger` only uses the transports you pass to it, so the sample above sends logs to Logz.io only.
If you also want to see the logs in your console, add a console transport:

```javascript
const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [logzioWinstonTransport, new winston.transports.Console()],
});
```

## Running with TypeScript

If you don't have a `tsconfig.json` file, start by running:

```bash
tsc --init
```

In your `tsconfig.json` file, under `compilerOptions`, make sure the `esModuleInterop` flag is set to `true`:

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

Code sample:

```typescript
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

Replace the placeholders as described in [Configure winston-logzio](#configure-winston-logzio).

### Troubleshooting

To fix errors related to the `esModuleInterop` flag, make sure you compile with the relevant `tsconfig.json` file.
These might help:

```bash
tsc <file-name>.ts --esModuleInterop
```

or

```bash
tsc --project tsconfig.json
```

## Add OpenTelemetry context

If you're sending traces with OpenTelemetry instrumentation (auto or manual), you can correlate your logs with the trace context. That way, your logs will have trace data in them, such as service name, span id and trace id (version >= `5.2.0`).

This feature is enabled by default. To disable it, set the `addOtelContext` option to `false`, like in this example:

```javascript
const winston = require('winston');
const LogzioWinstonTransport = require('winston-logzio');

const logzioWinstonTransport = new LogzioWinstonTransport({
    level: 'info',
    name: 'winston_logzio',
    token: '<<SHIPPING-TOKEN>>',
    host: '<<LISTENER-HOST>>',
    addOtelContext: false,
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
2. Install dependencies, then run the tests and the linter:
   ```bash
   npm install
   npm test
   npm run lint
   ```
