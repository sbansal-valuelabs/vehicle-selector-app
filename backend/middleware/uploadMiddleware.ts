import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { config } from '../config';
import { ERROR_MESSAGES } from '../constants/messages';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!config.allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error(ERROR_MESSAGES.INVALID_FILE_TYPE));
    }

    cb(null, true);
  },
});

export default upload;
