import Express from 'express';
import http from 'http';
import bearerToken from 'express-bearer-token';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressMonitor from 'express-status-monitor';
import terminus from '@godaddy/terminus';
import { logger, expressLogger, terminusConfig } from './config';
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

// adding graceful shutdown and health checks for the application
terminus(server, terminusConfig);

// starting the server
server.listen(process.env.APP_PORT, () => {
    logger.info({ message: `Server listening at http://${process.env.APP_HOST}:${process.env.APP_PORT}/` });
});
