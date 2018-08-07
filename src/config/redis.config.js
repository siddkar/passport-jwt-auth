import redis from 'redis';
import bluebird from 'bluebird';
import { logger } from './pino.config';

bluebird.promisifyAll(redis);

const redisHost = `${process.env.REDIS_HOST}`;
const redisPort = `${process.env.REDIS_PORT}`;
const redisKey = `${process.env.REDIS_KEY}`;


// connecting to redis with config param
const redisClient = redis.createClient({
    port: `${redisPort}`, // replace with your port
    host: `${redisHost}`, // replace with your hostanme or IP address
    password: `${redisKey}`, // replace with your password
});

redisClient.on('connect', () => {
    logger.info({ message: 'Connection with Redis-Server successful!!!' });
});

redisClient.on('error', (err) => {
    logger.error({ message: `Error establishing connection with Redis-Server!!! : ${err.message}` });
});

export default redisClient;
