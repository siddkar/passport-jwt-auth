import mongoose from 'mongoose';
import bluebird from 'bluebird';
import dotenv from 'dotenv';
import { logger } from './pino.config';

// instantiating dotenv
dotenv.config();

// Promisifing Mongoose
mongoose.Promise = bluebird.Promise;

// Getting the values from env prop files
const dbName = `${process.env.DB_NAME}`;
const dbUser = `${process.env.DB_USER}`;
const dbPass = `${process.env.DB_PASS}`;
const dbHost = `${process.env.DB_HOST}`;
const dbPort = `${process.env.DB_PORT}`;

// setting up the uri
const uri = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

/**
 * Mongoose version for > 5.0, mongoose.connecct
 * will always return a promise
 * mongoose.connect(uri);
 * converting mongoose.connect with async/await
 */
const initializeMongoose = async () => {
    await mongoose.connect(uri, { useNewUrlParser: true });
};

// intializing mongoose
initializeMongoose().catch(err => logger.error(`Error connecting to Mongo!!! ErrMsg : ${err}`));

mongoose.connection.once('open', () => {
    logger.info(`Successfully connected to the database : '${dbName}', authenticated with '${dbUser}'`);
});
export default mongoose;
