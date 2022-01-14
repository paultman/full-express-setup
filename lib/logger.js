const winston = require('winston');
const logger = winston.createLogger({
  level: 'info', // we want to pay attention to info level and below
  format: winston.format.json(), // a good format, albeit without colors
  defaultMeta: { service: 'user-service' }, // extra data added to the log
  transports: [ // here we define where logs should be sent, according to log level
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: './log/error.log', level: 'error' }),
    new winston.transports.File({ filename: './log/combined.log' }),
  ],
});
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
module.exports = logger;
