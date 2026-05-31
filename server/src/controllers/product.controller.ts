import type { Request, Response } from 'express';
import { asyncHandler, ok } from '@/utils/http';
import { productService } from '@/services/product.service';
import type { ProductQuery } from '@shared/types';

export const productController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = ((req as any).validatedQuery ?? {}) as ProductQuery;
    const result = await productService.list(query);
    // list endpoints return the Paginated<T> shape as `data`
    ok(res, result);
  }),
  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    ok(res, await productService.getBySlug(req.params.slug));
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    ok(res, await productService.create(req.body), undefined, 201);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    ok(res, await productService.update(req.params.id, req.body));
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    ok(res, await productService.remove(req.params.id));
  }),
};
