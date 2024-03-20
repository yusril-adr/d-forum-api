/* istanbul ignore file */
// Ignore test for avoiding creating file every test
// and avoiding replacing log file for production
const path = require('path');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const transport = new transports.DailyRotateFile({
  filename: path.join(__dirname, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.splat(),
  ),
  transports: [
    process.env.NODE_ENV === 'production' ? transport : new transports.Console(),
  ],
});

module.exports = logger;
