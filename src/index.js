import Express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { logger, expressLogger } from './config';

dotenv.config();

const app = Express();

app.use(expressLogger);

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: 'false' }));

app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'API is up and running...',
    });
});

app.listen(process.env.APP_PORT, () => {
    logger.info(`Server listening at http://${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});
