import express, { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import path from 'path';
import { vehicleData } from './vehicleData';

const app = express();
const port = 3000;

// Set up storage and file validation for multer.
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/plain') {
            return cb(new Error('Only plain text logbooks are accepted.'));
        }
        cb(null, true);
    },
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.urlencoded({ extended: true }));

app.get('/vehicles', (_req: Request, res: Response) => {
    res.json(vehicleData);
});

app.post('/upload', (req: Request, res: Response, next: NextFunction) => {
    upload.single('logbook')(req, res, (err) => {
        if (err) {
            return next(err);
        }

        const { make, model, badge } = req.body;
        const errors: string[] = [];

        if (!make || typeof make !== 'string' || !make.trim()) {
            errors.push('Make is required.');
        }
        if (!model || typeof model !== 'string' || !model.trim()) {
            errors.push('Model is required.');
        }
        if (!badge || typeof badge !== 'string' || !badge.trim()) {
            errors.push('Badge is required.');
        }

        if (errors.length) {
            return res.status(400).json({ error: errors.join(' ') });
        }

        const logbookContent = req.file ? req.file.buffer.toString('utf8') : 'No file uploaded.';

        res.json({ make, model, badge, logbookContent });
    });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    let status = 500;
    let errorMessage = 'Internal server error.';

    if (err instanceof MulterError) {
        status = 400;
        errorMessage = err.message;
    } else if (err instanceof Error) {
        errorMessage = err.message;
        if (errorMessage.includes('Only plain text logbooks are accepted.')) {
            status = 400;
        }
    }

    res.status(status).json({ error: errorMessage });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;