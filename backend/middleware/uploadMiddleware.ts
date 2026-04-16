import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype !== 'text/plain') {
      return cb(new Error('Only plain text logbooks are accepted.'));
    }

    cb(null, true);
  },
});

export default upload;
