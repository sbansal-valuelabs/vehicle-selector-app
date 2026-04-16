import { getVehicleData } from '../services/vehicleService';

describe('vehicleService', () => {
  it('returns the expected vehicle data structure', () => {
    const data = getVehicleData();

    expect(data).toHaveProperty('Ford');
    expect(data).toHaveProperty('BMW');
    expect(data).toHaveProperty('Tesla');

    expect(data.Ford).toHaveProperty('Ranger');
    expect(data.Ford.Ranger).toEqual(expect.arrayContaining(['Raptor', 'Raptor X', 'Wildtrak']));

    expect(data.BMW).toHaveProperty('320e');
    expect(data.BMW['320e']).toEqual(expect.arrayContaining(['xDrive 75d', 'xDrive 80d', 'xDrive 85d']));

    expect(data.Tesla).toHaveProperty('Model 3');
    expect(data.Tesla['Model 3']).toEqual(expect.arrayContaining(['Standard', 'Performance', 'Long Range']));
  });

  it('returns a non-empty vehicle data object', () => {
    const data = getVehicleData();

    expect(Object.keys(data).length).toBeGreaterThan(0);
    expect(Object.values(data).every((models) => Object.keys(models).length > 0)).toBe(true);
  });
});
