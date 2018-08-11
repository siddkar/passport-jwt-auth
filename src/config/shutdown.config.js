import { logger } from './pino.config';

const logInfo = connectionName => (logger.info({ message: `Connection with ${connectionName} shutdown gracefully!!!` }));

const shutdownRedis = (redisClient, connectionName) => {
    redisClient.quit();
    logInfo(connectionName);
};

const shutdownMongoose = (mongoose, connectionName) => {
    mongoose.connection.close(false);
    logInfo(connectionName);
};

export { shutdownRedis, shutdownMongoose };
