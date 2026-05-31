import { z } from 'zod';

/** Request DTOs as zod schemas — validated at the route boundary, types inferred for services. */

export const productImageSchema = z.object({ url: z.string().url(), alt: z.string().optional() });

export const createProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(1),
  brand: z.string().optional(),
  categoryId: z.string().min(1),
  tags: z.array(z.string()).optional(),
  images: z.array(productImageSchema).default([]),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  currency: z.enum(['PHP', 'USD']).optional(),
  variants: z
    .array(z.object({ name: z.string(), sku: z.string(), priceDelta: z.number(), stock: z.number() }))
    .optional(),
  stock: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  status: z.enum(['active', 'draft', 'archived']).optional(),
  featured: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  region: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().default('Philippines'),
  phone: z.string().optional(),
});

export const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string(), variantSku: z.string().optional(), quantity: z.number().int().positive() }))
    .min(1),
  shippingAddress: addressSchema,
  contactEmail: z.string().email(),
  currency: z.enum(['PHP', 'USD']),
  paymentProvider: z.enum(['mock', 'stripe', 'paymongo', 'xendit']).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'fulfilled', 'completed', 'cancelled', 'refunded']),
});

export const updateUserRoleSchema = z.object({ role: z.enum(['customer', 'admin']) });

export const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating', 'popular']).optional(),
  featured: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
