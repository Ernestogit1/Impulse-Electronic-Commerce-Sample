import type { Request, Response } from 'express';
import { asyncHandler, ok } from '@/utils/http';
import { categoryService } from '@/services/category.service';

export const categoryController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    ok(res, await categoryService.list());
  }),
};
