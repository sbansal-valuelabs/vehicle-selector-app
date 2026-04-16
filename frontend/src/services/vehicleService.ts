export interface SubmissionResult {
  make: string;
  model: string;
  badge: string;
  logbookContent: string;
}

export interface UploadData {
  make: string;
  model: string;
  badge: string;
  logbook?: File;
}

export type VehicleData = Record<string, Record<string, string[]>>;

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const headers = (response as unknown as { headers?: unknown }).headers;
  const contentType = typeof headers === 'object' && headers !== null
    ? (headers as { get?: (name: string) => string | null | undefined })?.get?.('content-type') ?? ''
    : '';

  const body = contentType.includes('application/json')
    ? await response.json()
    : typeof (response as { text?: () => Promise<string> }).text === 'function'
      ? await (response as { text: () => Promise<string> }).text()
      : await response.json();

  if (!response.ok) {
    const message = typeof body === 'object' && body !== null && 'error' in body
      ? (body as { error: string }).error
      : `Server error: ${response.status} ${response.statusText}`;

    throw new Error(message);
  }

  return body as T;
}

export async function uploadVehicle(data: UploadData): Promise<SubmissionResult> {
  const formData = new FormData();
  formData.append('make', data.make);
  formData.append('model', data.model);
  formData.append('badge', data.badge);

  if (data.logbook) {
    formData.append('logbook', data.logbook);
  }

  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });

  return parseJsonResponse<SubmissionResult>(response);
}

export async function fetchVehicleData(): Promise<VehicleData> {
  const response = await fetch('/vehicles');
  return parseJsonResponse<VehicleData>(response);
}
