import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';
import { ApiError } from '@/utils/ApiError';

type Source = 'body' | 'query' | 'params';

/** Validate & coerce a request part with a zod schema; replaces it with the parsed value. */
export const validate =
  (schema: ZodTypeAny, source: Source = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      // query is read-only on some Express versions — stash parsed values for handlers
      if (source === 'query') (req as any).validatedQuery = parsed;
      else (req as any)[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(ApiError.badRequest('Validation failed', err.flatten()));
      } else {
        next(err);
      }
    }
  };
