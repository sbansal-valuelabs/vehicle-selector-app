import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { ERROR_MESSAGES } from '../constants/messages';

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): Response => {
  let status = 500;
  let message = ERROR_MESSAGES.INTERNAL_ERROR;

  if (err instanceof MulterError) {
    status = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = ERROR_MESSAGES.FILE_TOO_LARGE;
    } else {
      message = err.message;
    }
  } else if (err instanceof Error) {
    message = err.message;
    if (message.includes(ERROR_MESSAGES.INVALID_FILE_TYPE)) {
      status = 400;
    }
  }

  return res.status(status).json({ error: message });
};

export default errorHandler;
