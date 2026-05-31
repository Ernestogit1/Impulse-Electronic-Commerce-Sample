import type { Request, Response } from 'express';
import { asyncHandler, ok } from '@/utils/http';
import { orderService } from '@/services/order.service';
import { ApiError } from '@/utils/ApiError';

export const orderController = {
  checkout: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;
    const order = await orderService.checkout(req.body, { id: user.id, email: user.email });
    ok(res, order, undefined, 201);
  }),
  listMine: asyncHandler(async (req: Request, res: Response) => {
    ok(res, await orderService.listMine(req.user!.id));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    ok(res, await orderService.getById(req.params.id, { id: req.user.id, role: req.user.role }));
  }),
};
