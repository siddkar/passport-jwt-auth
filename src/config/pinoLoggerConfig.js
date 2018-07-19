import expressPino from 'express-pino-logger';
import pino from 'pino';

const logger = pino();
const expressLogger = expressPino();

export { logger, expressLogger };
