import winston from 'winston';
import { IS_PRODUCTION } from '../constants.js';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(stack && { stack }),
      ...meta
    });
  })
);

export const logger = winston.createLogger({
  level: IS_PRODUCTION ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'stock-api' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10485760,
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 5
    })
  ],
});

if (!IS_PRODUCTION) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}