export type VehicleData = Record<string, Record<string, string[]>>;

export interface UploadData {
  make: string;
  model: string;
  badge: string;
  logbook?: File;
}

export interface SubmissionResult {
  make: string;
  model: string;
  badge: string;
  logbookContent: string;
}
