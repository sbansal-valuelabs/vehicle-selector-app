import { Router } from 'express';
import vehiclesRouter from './vehicles';
import uploadRouter from './upload';

const router = Router();

router.use(vehiclesRouter);
router.use(uploadRouter);

export default router;
