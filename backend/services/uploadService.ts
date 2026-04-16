export interface UploadFields {
  make?: unknown;
  model?: unknown;
  badge?: unknown;
}

export const validateUploadFields = ({ make, model, badge }: UploadFields): string[] => {
  const errors: string[] = [];

  if (!make || typeof make !== 'string' || !make.trim()) {
    errors.push('Make is required.');
  }
  if (!model || typeof model !== 'string' || !model.trim()) {
    errors.push('Model is required.');
  }
  if (!badge || typeof badge !== 'string' || !badge.trim()) {
    errors.push('Badge is required.');
  }

  return errors;
};

export const getLogbookContent = (file: Express.Multer.File | undefined): string => {
  return file?.buffer.toString('utf8') ?? 'No file uploaded.';
};
