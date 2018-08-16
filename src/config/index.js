import initializeDotenv from './dotenv.config';
import mongoose from './db.config';
import redisClient from './redis.config';
import terminusConfig from './terminus.config';
import onDeathCallback from './death.config';
import { logger, expressLogger } from './pino.config';

// initializing env once
if (initializeDotenv.parsed) {
    logger.info({ message: 'Successfully initialized env !!!' });
} else if (initializeDotenv.error) {
    logger.error({ message: 'Error initializing env !!!' });
}

export {
    mongoose,
    logger,
    expressLogger,
    redisClient,
    onDeathCallback,
    terminusConfig,
};
