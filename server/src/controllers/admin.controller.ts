import type { Request, Response } from 'express';
import { asyncHandler, ok } from '@/utils/http';
import { orderService } from '@/services/order.service';
import { userService } from '@/services/user.service';
import { analyticsService } from '@/services/analytics.service';

export const adminController = {
  // orders
  listOrders: asyncHandler(async (_req: Request, res: Response) => ok(res, await orderService.listAll())),
  updateOrderStatus: asyncHandler(async (req: Request, res: Response) =>
    ok(res, await orderService.updateStatus(req.params.id, req.body.status)),
  ),
  // users
  listUsers: asyncHandler(async (_req: Request, res: Response) => ok(res, await userService.list())),
  updateUserRole: asyncHandler(async (req: Request, res: Response) =>
    ok(res, await userService.updateRole(req.params.id, req.body.role)),
  ),
  // analytics
  overview: asyncHandler(async (_req: Request, res: Response) => ok(res, await analyticsService.overview())),
  revenue: asyncHandler(async (_req: Request, res: Response) => ok(res, await analyticsService.revenueSeries())),
  topProducts: asyncHandler(async (_req: Request, res: Response) => ok(res, await analyticsService.topProducts())),
  ordersByStatus: asyncHandler(async (_req: Request, res: Response) => ok(res, await analyticsService.ordersByStatus())),
  lowStock: asyncHandler(async (_req: Request, res: Response) => ok(res, await analyticsService.lowStock())),
};
