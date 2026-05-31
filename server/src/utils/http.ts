import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { PaginationMeta } from '@shared/types';

/** Wrap async route handlers so thrown/rejected errors reach the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/** Standard success envelope. */
export function ok<T>(res: Response, data: T, meta?: PaginationMeta, status = 200) {
  return res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function paginate(page = 1, limit = 12) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 12));
  return { page: p, limit: l, skip: (p - 1) * l };
}

export const metaFor = (page: number, limit: number, total: number): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});
