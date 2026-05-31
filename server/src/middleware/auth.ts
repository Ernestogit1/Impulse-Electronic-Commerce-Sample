import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/config/firebaseAdmin';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/utils/ApiError';
import { asyncHandler } from '@/utils/http';
import type { AuthUser } from '@shared/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/** Verify the bearer token, sync/load the Mongo user, attach req.user. */
export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw ApiError.unauthorized();
  const token = header.slice(7);

  let verified;
  try {
    verified = await verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const user = await authService.syncUser(verified);
  req.user = {
    id: user.id,
    firebaseUid: user.firebaseUid,
    email: user.email,
    name: user.name,
    role: user.role,
    photoURL: user.photoURL,
  };
  next();
});

/** Require an authenticated admin. Use after requireAuth. */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (req.user.role !== 'admin') return next(ApiError.forbidden('Admin access required'));
  next();
};
