import { apiFetch } from './api';
import type { SubmissionResult, UploadData, VehicleData } from '../types/vehicle';

export async function uploadVehicle(data: UploadData): Promise<SubmissionResult> {
  const formData = new FormData();
  formData.append('make', data.make);
  formData.append('model', data.model);
  formData.append('badge', data.badge);

  if (data.logbook) {
    formData.append('logbook', data.logbook);
  }

  return apiFetch<SubmissionResult>('/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function fetchVehicleData(): Promise<VehicleData> {
  return apiFetch<VehicleData>('/vehicles');
}
