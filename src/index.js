import Express from 'express';
import bearerToken from 'express-bearer-token';
import bodyParser from 'body-parser';
import expressMonitor from 'express-status-monitor';
import { logger, expressLogger } from './config';
import router from './routes';
import { PassportMiddleware, errorHandlerMiddleware } from './middlewares';

// initialize express
const app = Express();

app.use(expressMonitor({ path: '/api/status' }).middleware);

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

// starting the server
app.listen(process.env.APP_PORT, () => {
    logger.info({ message: `Server listening at http://${process.env.APP_HOST}:${process.env.APP_PORT}/` });
});
