import { logger } from '../config/pino.config';

const logError = (from, code, error) => {
    logger.error({ from, code, error });
};

export default logError;
