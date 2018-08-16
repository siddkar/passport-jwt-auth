import { logger } from './pino.config';
import mongoose from './db.config';
import redisClient from './redis.config';

const logError = (from, code, error) => (logger.error({ from, code, error }));

const logInfo = connectionName => (logger.info({ message: `Connection with ${connectionName} shutdown gracefully!!!` }));

const timeout = 1000;

const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'];

const mongoHealthCheck = () => {
    const { readyState } = mongoose.connection;
    if (readyState === 0 || readyState === 3) {
        return 'ERR_CONNECTING_TO_MONGO';
    }
    if (readyState === 2) {
        return 'CONNECTING_TO_MONGO';
    }
    return 'CONNECTED_TO_MONGO';
};

const redisHealthCheck = () => (redisClient.connected ? 'CONNECTED_TO_REDIS' : 'ERR_CONNECTING_TO_REDIS');

const onHealthCheck = async () => {
    const mongoHealth = mongoHealthCheck();
    const redisHealth = redisHealthCheck();
    return {
        mongoHealth,
        redisHealth,
    };
};

const shutdownRedis = connectionName => redisClient.quit()
    .then(() => console.log(connectionName))
    .catch(err => console.log('terminus.config.shutdownRedis', 'ERR_DISCONNECTING_FROM_REDIS', err));

const shutdownMongoose = connectionName => mongoose.connection.close(false)
    .then(() => console.log(connectionName))
    .catch(err => console.log('terminus.config.shutdownMongoose', 'ERR_DISCONNECTING_FROM_MONGO', err));

const onSignal = () => Promise.all([shutdownRedis('Redis'), shutdownMongoose('Mongo')])
    .then(() => console.log({ message: 'All services gracefully shutdown' }))
    .catch(err => console.log('terminus.config.onSignal', 'ERR_DISCONNECTING_SERVICES', err));

const beforeShutdown = () => new Promise((resolve) => {
    console.log('==========================');
    console.log('I AM HERE : beforeShutdown');
    console.log('==========================');
    setTimeout(resolve, 5000);
});

const healthChecks = {
    '/healthcheck': onHealthCheck,
};

const terminusConfig = {
    timeout,
    healthChecks,
    signals,
    beforeShutdown,
    onSignal,
};

export default terminusConfig;
