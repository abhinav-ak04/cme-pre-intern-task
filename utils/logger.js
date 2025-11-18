// utils/logger.js
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  base: undefined,

  messageKey: 'msg',

  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
