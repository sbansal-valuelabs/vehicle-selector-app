import express from 'express';
import path from 'path';
import routes from './routes';
import errorHandler from './middleware/errorHandler';
import { config } from './config';

const app = express();

app.use(express.static(config.staticPath));
app.use(express.urlencoded({ extended: true, limit: config.maxBodySize }));
app.use(express.json({ limit: config.maxBodySize }));
app.use(routes);
app.use(errorHandler);

if (require.main === module) {
    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
    });
}

export default app;