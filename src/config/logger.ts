import { createLogger, format, transports } from 'winston';
import { config } from '.';

const { combine, timestamp, colorize } = format;

const logger = createLogger({
  format: combine(colorize(), timestamp(), format.json()),
  transports: [new transports.File({ filename: 'error.log', level: 'error' }), new transports.File({ filename: 'combined.log' })],
});

if (config.get('env') === 'production') {
  logger.level = 'info';
} else {
  logger.add(new transports.Console({}));
  logger.level = 'debug';
}

export default logger;
