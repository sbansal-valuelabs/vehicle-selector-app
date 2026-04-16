import express from 'express';
import path from 'path';
import routes from './routes';
import errorHandler from './middleware/errorHandler';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use(errorHandler);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;