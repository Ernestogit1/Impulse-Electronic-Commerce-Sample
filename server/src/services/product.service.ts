import { repositories } from '@/repositories';
import { ApiError } from '@/utils/ApiError';
import type { CreateProductDTO, ProductQuery, UpdateProductDTO } from '@shared/types';

export const productService = {
  async list(query: ProductQuery) {
    const { items, total } = await repositories.products.list(query);
    const page = Math.max(1, query.page ?? 1);
    const limit = query.limit ?? 12;
    return { items, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  },
  async getBySlug(slug: string) {
    const product = await repositories.products.findBySlug(slug);
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  },
  create(dto: CreateProductDTO) {
    return repositories.products.create(dto);
  },
  async update(id: string, dto: UpdateProductDTO) {
    const updated = await repositories.products.update(id, dto);
    if (!updated) throw ApiError.notFound('Product not found');
    return updated;
  },
  async remove(id: string) {
    const ok = await repositories.products.remove(id);
    if (!ok) throw ApiError.notFound('Product not found');
    return { id };
  },
};
