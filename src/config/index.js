import initializeDotenv from './dotenv.config';
import mongoose from './db.config';
import redisClient from './redis.config';
import { logger, expressLogger } from './pino.config';
import { shutdownRedis, shutdownMongoose } from './shutdown.config';

// initializing env once
if (initializeDotenv.parsed) {
    logger.info({ message: 'Successfully initialized env !!!' });
} else if (initializeDotenv.error) {
    logger.error({ message: 'Error initializing env !!!' });
}

// keeps the process running even after exit is called
process.stdin.resume();

// SIGINT listens to ctrl+c
process.on('SIGINT', () => {
    shutdownRedis(redisClient, 'RedisClient');
    shutdownMongoose(mongoose, 'Mongoose');
    process.exit();
});

export {
    mongoose,
    logger,
    expressLogger,
    redisClient,
};
