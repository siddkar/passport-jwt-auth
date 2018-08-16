import mongoose from './db.config';
import redisClient from './redis.config';
import { logger } from './pino.config';

const logError = (from, code, error) => {
    logger.error({ from, code, error });
};

const logInfo = connectionName => (logger.info({ message: `Connection with ${connectionName} shutdown gracefully!!!` }));

const shutdownRedis = () => redisClient.quit();

const shutdownMongoose = () => mongoose.connection.close(false);

const onDeathCallback = async () => {
    try {
        await shutdownRedis();
        logInfo('Redis');
        await shutdownMongoose();
        logInfo('Mongo');
    } catch (err) {
        logError('death.config.onDeathCallback', 'ERR_GRACEFUL_CONN_SHUTDOWN', err);
    }
};

export default onDeathCallback;
