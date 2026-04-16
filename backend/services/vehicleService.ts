import { vehicleData } from '../vehicleData';

export type VehicleData = typeof vehicleData;

export const getVehicleData = (): VehicleData => {
  return vehicleData;
};
