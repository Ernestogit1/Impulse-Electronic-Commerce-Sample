/**
 * Data-source abstraction — the single seam between the UI and "where data comes from".
 *
 * The whole app talks to `data` (typed below). Today it resolves to the in-app mock
 * service; flipping VITE_USE_MOCK_API=false swaps in the HTTP service that calls the real
 * Express API — with NO changes to any feature/component/RTK-Query code. This is the
 * service-layer + API-abstraction pattern that makes the frontend-first plan work.
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
import { env } from '@/lib/env';
import { mockService } from './mock/mockService';
import { httpService } from './http/httpService';

export interface DataApi {
  // catalog
  listProducts(query: ProductQuery): Promise<Paginated<Product>>;
  getProductBySlug(slug: string): Promise<Product>;
  listCategories(): Promise<Category[]>;
  // admin catalog
  createProduct(dto: CreateProductDTO): Promise<Product>;
  updateProduct(id: string, dto: UpdateProductDTO): Promise<Product>;
  deleteProduct(id: string): Promise<{ id: string }>;
  // orders
  checkout(dto: CheckoutDTO, user: AuthUser): Promise<Order>;
  listMyOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order>;
  // admin
  adminListOrders(): Promise<Order[]>;
  adminUpdateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
  adminListUsers(): Promise<User[]>;
  adminUpdateUserRole(id: string, role: UserRole): Promise<User>;
  // analytics
  analyticsOverview(): Promise<AnalyticsOverview>;
  revenueSeries(): Promise<RevenuePoint[]>;
  topProducts(): Promise<TopProduct[]>;
  ordersByStatus(): Promise<OrdersByStatus[]>;
  lowStock(): Promise<LowStockItem[]>;
}

export const data: DataApi = env.useMockApi ? mockService : httpService;
