import { useEffect, useState } from 'react';
import { fetchVehicleData } from '../services/vehicleService';
import type { VehicleData } from '../types/vehicle';

export function useVehicleData() {
  const [vehicleData, setVehicleData] = useState<VehicleData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicleData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchVehicleData();
        setVehicleData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load vehicle data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicleData();
  }, []);

  return { vehicleData, isLoading, error };
}
