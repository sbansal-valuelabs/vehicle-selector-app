import { Router, NextFunction, Request, Response } from 'express';
import uploadMiddleware from '../middleware/uploadMiddleware';
import { getLogbookContent, validateUploadFields } from '../services/uploadService';

const router = Router();

router.post('/upload', uploadMiddleware.single('logbook'), (req: Request, res: Response, next: NextFunction) => {
  try {
    const { make, model, badge } = req.body;
    const errors = validateUploadFields({ make, model, badge });

    if (errors.length) {
      return res.status(400).json({ error: errors.join(' ') });
    }

    const logbookContent = getLogbookContent(req.file);

    return res.json({ make, model, badge, logbookContent });
  } catch (error) {
    return next(error);
  }
});

export default router;
