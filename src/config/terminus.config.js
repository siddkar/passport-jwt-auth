import mongoose from './db.config';
import redisClient from './redis.config';

const timeout = 1000;

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

const healthChecks = {
    '/healthcheck': onHealthCheck,
};

const terminusConfig = {
    timeout,
    healthChecks,
};

export default terminusConfig;
