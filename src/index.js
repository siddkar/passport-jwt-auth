import Express from 'express';
import http from 'http';
import bearerToken from 'express-bearer-token';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressMonitor from 'express-status-monitor';
import terminus from '@godaddy/terminus';
import ON_DEATH from 'death';
import {
    logger,
    expressLogger,
    terminusConfig,
    onDeathCallback,
} from './config';
import logError from './utils/log.error';
import router from './routes';
import { PassportMiddleware, errorHandlerMiddleware } from './middlewares';

// initialize express
const app = Express();

// adding express monitor for real time stats
app.use(expressMonitor({ path: '/status' }).middleware);

// adding cors to express
app.use(cors());

// adding pino express logger middleware to express
app.use(expressLogger);

// adding body parser middlewaree to express
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: 'false' }));

// adding bearerToken middleware to fetch the token from request
app.use(bearerToken());

// adding authentication middleware to express
app.use(PassportMiddleware.initialize());

// adding context path
app.use('/api', router);

app.get('/api', (req, res) => res.status(200).json({
    status: 200,
    message: 'API is up and running... Please login to continue...',
}));

app.get('/', (req, res) => res.redirect('/api'));

// adding error handler middleware to express to handle errors
app.use(errorHandlerMiddleware);

// creating http server
const server = http.createServer(app);

// Begin reading from stdin so the process does not exit imidiately
process.stdin.resume();

// adding health checks for the application
terminus(server, terminusConfig);

// starting the server
const httpServer = server.listen(process.env.APP_PORT, () => {
    logger.info({ message: `Server listening at http://${process.env.APP_HOST}:${process.env.APP_PORT}/` });
});

// adding logic to gracefully shutdown express server
const deathCallback = async (signal) => {
    try {
        await onDeathCallback();
        await httpServer.close();
        logger.info({ message: 'Server Shutdown Gracefully!!!' });
        logger.info({ message: `Termination Signal: ${signal} :: All services shutdown successfully!!!` });
    } catch (err) {
        logError('index.deathCallback', 'ERR_GRACEFUL_CONN_SHUTDOWN', err);
    }
};

// adding graceful shutdown for active connections
ON_DEATH(deathCallback);

export default httpServer;
