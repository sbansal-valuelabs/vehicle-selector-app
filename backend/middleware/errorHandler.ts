import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): Response => {
  let status = 500;
  let message = 'Internal server error.';

  if (err instanceof MulterError) {
    status = 400;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
    if (message.includes('Only plain text logbooks are accepted.')) {
      status = 400;
    }
  }

  return res.status(status).json({ error: message });
};

export default errorHandler;
