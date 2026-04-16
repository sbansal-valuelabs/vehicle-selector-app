import { Router } from 'express';
import { getVehicleData } from '../services/vehicleService';

const router = Router();

router.get('/vehicles', (_req, res) => {
  res.json(getVehicleData());
});

export default router;
