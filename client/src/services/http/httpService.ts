/**
 * HTTP implementation of DataApi — talks to the real Express backend (M5).
 * Activated by setting VITE_USE_MOCK_API=false. Mirrors mockService exactly so the
 * rest of the app is unaware of which one is live.
 */
import type {
  AnalyticsOverview,
  AuthUser,
  Category,
  CheckoutDTO,
  CreateProductDTO,
  LowStockItem,
  Order,
  OrderStatus,
  OrdersByStatus,
  Paginated,
  Product,
  ProductQuery,
  RevenuePoint,
  TopProduct,
  UpdateProductDTO,
  User,
  UserRole,
} from '@shared/types';
import type { DataApi } from '../dataSource';
import { apiClient, unwrap } from '@/lib/apiClient';

export const httpService: DataApi = {
  listProducts: (query: ProductQuery) =>
    unwrap<Paginated<Product>>(apiClient.get('/products', { params: query })),
  getProductBySlug: (slug) => unwrap<Product>(apiClient.get(`/products/${slug}`)),
  listCategories: () => unwrap<Category[]>(apiClient.get('/categories')),

  createProduct: (dto: CreateProductDTO) => unwrap<Product>(apiClient.post('/products', dto)),
  updateProduct: (id, dto: UpdateProductDTO) =>
    unwrap<Product>(apiClient.put(`/products/${id}`, dto)),
  deleteProduct: (id) => unwrap<{ id: string }>(apiClient.delete(`/products/${id}`)),

  checkout: (dto: CheckoutDTO, _user: AuthUser) => unwrap<Order>(apiClient.post('/orders', dto)),
  listMyOrders: (_userId) => unwrap<Order[]>(apiClient.get('/orders')),
  getOrder: (id) => unwrap<Order>(apiClient.get(`/orders/${id}`)),

  adminListOrders: () => unwrap<Order[]>(apiClient.get('/admin/orders')),
  adminUpdateOrderStatus: (id, status: OrderStatus) =>
    unwrap<Order>(apiClient.patch(`/admin/orders/${id}/status`, { status })),
  adminListUsers: () => unwrap<User[]>(apiClient.get('/admin/users')),
  adminUpdateUserRole: (id, role: UserRole) =>
    unwrap<User>(apiClient.patch(`/admin/users/${id}/role`, { role })),

  analyticsOverview: () => unwrap<AnalyticsOverview>(apiClient.get('/admin/analytics/overview')),
  revenueSeries: () => unwrap<RevenuePoint[]>(apiClient.get('/admin/analytics/revenue')),
  topProducts: () => unwrap<TopProduct[]>(apiClient.get('/admin/analytics/top-products')),
  ordersByStatus: () => unwrap<OrdersByStatus[]>(apiClient.get('/admin/analytics/orders-by-status')),
  lowStock: () => unwrap<LowStockItem[]>(apiClient.get('/admin/analytics/low-stock')),
};
