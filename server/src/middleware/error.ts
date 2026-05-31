import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, error: { code: 'not_found', message: 'Route not found' } });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ success: false, error: { code: err.code, message: err.message, details: err.details } });
  }
  console.error('[Impulse] Unhandled error:', err);
  return res
    .status(500)
    .json({ success: false, error: { code: 'internal_error', message: 'Something went wrong' } });
}
