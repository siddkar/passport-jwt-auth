import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { logger } from './pino.config';

// Promisifing Mongoose
mongoose.Promise = bluebird.Promise;

// Getting the values from env prop files
const dbPrefix = `${process.env.DB_PREFIX}`;
const dbName = `${process.env.DB_NAME}`;
const dbUser = `${process.env.DB_USER}`;
const dbPass = `${process.env.DB_PASS}`;
const dbHost = `${process.env.DB_HOST}`; // Includes DBPort

// setting up the uri
// const uri = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}`;
const uri = `${dbPrefix}://${dbUser}:${dbPass}@${dbHost}/${dbName}`;

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
    logger.info({ message: `Successfully connected to the database : '${dbName}', authenticated with '${dbUser}'` });
});
export default mongoose;
