import pino from 'pino';

// Decide if we are in production (GKE, CI, etc.) or not
const isProd = process.env.NODE_ENV === 'production';

// In prod: raw JSON logs (best for Cloud Logging)
// In dev: pretty print so it's readable in your terminal
const logger = pino(
  isProd
    ? {} // default: JSON to stdout
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      }
);

export default logger;
