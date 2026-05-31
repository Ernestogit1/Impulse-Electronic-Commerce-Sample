import { Router } from 'express';
import { requireAuth, requireAdmin } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  checkoutSchema,
  updateOrderStatusSchema,
  updateUserRoleSchema,
} from '@/dto/schemas';
import { productController } from '@/controllers/product.controller';
import { categoryController } from '@/controllers/catalog.controller';
import { orderController } from '@/controllers/order.controller';
import { adminController } from '@/controllers/admin.controller';
import { authController } from '@/controllers/auth.controller';
import { paymentController } from '@/controllers/payment.controller';

export const apiRouter = Router();

/* Auth */
apiRouter.get('/auth/me', requireAuth, authController.me);
apiRouter.post('/auth/sync', requireAuth, authController.sync);

/* Catalog (public) */
apiRouter.get('/products', validate(productQuerySchema, 'query'), productController.list);
apiRouter.get('/products/:slug', productController.getBySlug);
apiRouter.get('/categories', categoryController.list);

/* Catalog admin */
apiRouter.post('/products', requireAuth, requireAdmin, validate(createProductSchema), productController.create);
apiRouter.put('/products/:id', requireAuth, requireAdmin, validate(updateProductSchema), productController.update);
apiRouter.delete('/products/:id', requireAuth, requireAdmin, productController.remove);

/* Orders (customer) */
apiRouter.post('/orders', requireAuth, validate(checkoutSchema), orderController.checkout);
apiRouter.get('/orders', requireAuth, orderController.listMine);
apiRouter.get('/orders/:id', requireAuth, orderController.getById);

/* Payments */
apiRouter.post('/payments/webhook', paymentController.webhook);

/* Admin */
apiRouter.get('/admin/orders', requireAuth, requireAdmin, adminController.listOrders);
apiRouter.patch('/admin/orders/:id/status', requireAuth, requireAdmin, validate(updateOrderStatusSchema), adminController.updateOrderStatus);
apiRouter.get('/admin/users', requireAuth, requireAdmin, adminController.listUsers);
apiRouter.patch('/admin/users/:id/role', requireAuth, requireAdmin, validate(updateUserRoleSchema), adminController.updateUserRole);
apiRouter.get('/admin/analytics/overview', requireAuth, requireAdmin, adminController.overview);
apiRouter.get('/admin/analytics/revenue', requireAuth, requireAdmin, adminController.revenue);
apiRouter.get('/admin/analytics/top-products', requireAuth, requireAdmin, adminController.topProducts);
apiRouter.get('/admin/analytics/orders-by-status', requireAuth, requireAdmin, adminController.ordersByStatus);
apiRouter.get('/admin/analytics/low-stock', requireAuth, requireAdmin, adminController.lowStock);
