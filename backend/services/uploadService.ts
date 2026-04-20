import { ERROR_MESSAGES } from '../constants/messages';

export interface UploadFields {
  make?: unknown;
  model?: unknown;
  badge?: unknown;
}

export const validateUploadFields = ({ make, model, badge }: UploadFields): string[] => {
  const errors: string[] = [];

  if (!make || typeof make !== 'string' || !make.trim()) {
    errors.push(ERROR_MESSAGES.MAKE_REQUIRED);
  }
  if (!model || typeof model !== 'string' || !model.trim()) {
    errors.push(ERROR_MESSAGES.MODEL_REQUIRED);
  }
  if (!badge || typeof badge !== 'string' || !badge.trim()) {
    errors.push(ERROR_MESSAGES.BADGE_REQUIRED);
  }

  return errors;
};

export const getLogbookContent = (file: Express.Multer.File | undefined): string => {
  return file?.buffer.toString('utf8') ?? 'No file uploaded.';
};
