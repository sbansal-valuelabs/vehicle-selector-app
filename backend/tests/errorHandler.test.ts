import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import errorHandler from '../middleware/errorHandler';

describe('errorHandler middleware', () => {
  const createResponseMock = () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    return { status, json } as unknown as Response;
  };

  it('returns 500 for generic errors', () => {
    const res = createResponseMock();
    const err = new Error('Something went wrong');

    errorHandler(err, {} as Request, res, {} as NextFunction);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
  });

  it('returns 400 for plain text validation errors', () => {
    const res = createResponseMock();
    const err = new Error('Only plain text logbooks are accepted.');

    errorHandler(err, {} as Request, res, {} as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Only plain text logbooks are accepted.' });
  });

  it('returns 400 for Multer errors', () => {
    const res = createResponseMock();
    const err = new MulterError('LIMIT_FILE_SIZE');

    errorHandler(err, {} as Request, res, {} as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: err.message });
  });
});
