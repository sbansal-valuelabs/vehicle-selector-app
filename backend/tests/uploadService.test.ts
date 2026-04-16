import { validateUploadFields, getLogbookContent } from '../services/uploadService';

describe('uploadService', () => {
  it('returns no errors for valid upload fields', () => {
    const errors = validateUploadFields({ make: 'Honda', model: 'Civic', badge: 'LX' });

    expect(errors).toEqual([]);
  });

  it('returns required field errors for missing values', () => {
    const errors = validateUploadFields({ make: '', model: null, badge: undefined });

    expect(errors).toEqual(['Make is required.', 'Model is required.', 'Badge is required.']);
  });

  it('returns default logbook content when no file is provided', () => {
    const content = getLogbookContent(undefined);

    expect(content).toBe('No file uploaded.');
  });

  it('returns the file text from the uploaded logbook buffer', () => {
    const fakeFile = {
      buffer: Buffer.from('Inspection passed.'),
    } as Express.Multer.File;

    const content = getLogbookContent(fakeFile);

    expect(content).toBe('Inspection passed.');
  });
});
