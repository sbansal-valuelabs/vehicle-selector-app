import { apiFetch } from './api';
import { API_CONFIG } from '../constants/appConstants';
import type { SubmissionResult, UploadData, VehicleData } from '../types/vehicle';

export async function uploadVehicle(data: UploadData): Promise<SubmissionResult> {
  const formData = new FormData();
  formData.append('make', data.make);
  formData.append('model', data.model);
  formData.append('badge', data.badge);

  if (data.logbook) {
    formData.append('logbook', data.logbook);
  }

  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD}`;
  return apiFetch<SubmissionResult>(url, {
    method: 'POST',
    body: formData,
  });
}

export async function fetchVehicleData(): Promise<VehicleData> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VEHICLES}`;
  return apiFetch<VehicleData>(url);
}
