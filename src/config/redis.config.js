import redis from 'redis';
import bluebird from 'bluebird';
import { logger } from './pino.config';

bluebird.promisifyAll(redis);
// connecting to redis with default config
const redisClient = redis.createClient();

redisClient.on('connect', () => {
    logger.info({ message: 'Connection with Redis-Server successful!!!' });
});

redisClient.on('error', (err) => {
    logger.error({ message: `Error establishing connection with Redis-Server!!! : ${err.message}` });
});

export default redisClient;
