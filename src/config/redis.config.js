import redis from 'redis';
import bluebird from 'bluebird';
import { logger } from './pino.config';

bluebird.promisifyAll(redis);
// connecting to redis with default config
const redisClient = redis.createClient();

redisClient.on('connect', () => {
    logger.info('Connection with Redis-Server successful!!!');
});

redisClient.on('error', () => {
    logger.error('Error establishing connection with Redis-Server!!!');
});

export default redisClient;
