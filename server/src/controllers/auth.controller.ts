import type { Request, Response } from 'express';
import { asyncHandler, ok } from '@/utils/http';

export const authController = {
  /** requireAuth already synced the user — just echo the current profile. */
  me: asyncHandler(async (req: Request, res: Response) => {
    ok(res, req.user);
  }),
  sync: asyncHandler(async (req: Request, res: Response) => {
    ok(res, req.user);
  }),
};
