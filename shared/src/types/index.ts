/**
 * Impulse Storefront — shared wire contracts (single source of truth).
 * Imported by BOTH the client (types for RTK Query + UI) and the server (DTO inference).
 * Keep this framework-free: pure TypeScript types/enums only.
 */

/* ────────────────────────────── Primitives & enums ───────────────────────────── */

export type ID = string;
export type CurrencyCode = 'PHP' | 'USD';
export type ThemeMode = 'dark' | 'light';

export type UserRole = 'customer' | 'admin';
export type ProductStatus = 'active' | 'draft' | 'archived';
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'fulfilled'
  | 'completed'
  | 'cancelled'
  | 'refunded';
export type PaymentStatus = 'requires_action' | 'authorized' | 'paid' | 'failed' | 'refunded';
export type PaymentProviderName = 'mock' | 'stripe' | 'paymongo' | 'xendit';

/* ────────────────────────────── Catalog ───────────────────────────── */

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: ID | null;
  isActive: boolean;
  productCount?: number;
}

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductVariant {
  name: string; // e.g. "Size / Color"
  sku: string;
  priceDelta: number; // added to base price
  stock: number;
}

export interface ProductReviewSummary {
  rating: number; // 0..5 average
  count: number;
}

export interface Product {
  id: ID;
  title: string;
  slug: string;
  description: string;
  brand?: string;
  categoryId: ID;
  categorySlug?: string;
  categoryName?: string;
  tags: string[];
  images: ProductImage[];
  price: number; // base price, in `currency`
  compareAtPrice?: number; // for "was" pricing / discounts
  currency: CurrencyCode;
  variants: ProductVariant[];
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: ID;
  productId: ID;
  userId: ID;
  userName: string;
  rating: number; // 1..5
  title?: string;
  body: string;
  createdAt: string;
}

/* ────────────────────────────── Users ───────────────────────────── */

export interface Address {
  id?: ID;
  label?: string; // "Home", "Office"
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface User {
  id: ID;
  firebaseUid: string;
  email: string;
  name: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  addresses: Address[];
  /** Always the literal placeholder on the backend — real credentials live in Firebase. */
  passwordPlaceholder?: 'firebase-managed';
  createdAt: string;
  updatedAt: string;
}

/* ────────────────────────────── Cart & Wishlist ───────────────────────────── */

export interface CartItem {
  productId: ID;
  variantSku?: string;
  quantity: number;
  // denormalized snapshot for display (kept fresh by the service/mock layer)
  title: string;
  slug: string;
  image?: string;
  unitPrice: number;
  currency: CurrencyCode;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  currency: CurrencyCode;
}

export interface Wishlist {
  productIds: ID[];
}

/* ────────────────────────────── Orders & Payments ───────────────────────────── */

export interface OrderItem {
  productId: ID;
  title: string;
  image?: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
}

export interface PaymentInfo {
  provider: PaymentProviderName;
  intentId: string;
  transactionId?: string;
  status: PaymentStatus;
  amount: number;
  currency: CurrencyCode;
}

export interface Order {
  id: ID;
  orderNumber: string;
  userId: ID;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: CurrencyCode;
  shippingAddress: Address;
  contactEmail: string;
  payment: PaymentInfo;
  status: OrderStatus;
  placedAt: string;
  updatedAt: string;
}

/* ────────────────────────────── API envelope & paging ───────────────────────────── */

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiFailure {
  success: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

/* ────────────────────────────── Query params & DTOs ───────────────────────────── */

export type ProductSort =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'popular';

export interface ProductQuery {
  q?: string;
  category?: string; // slug
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  featured?: boolean;
  status?: ProductStatus;
  page?: number;
  limit?: number;
}

export interface CreateProductDTO {
  title: string;
  description: string;
  brand?: string;
  categoryId: ID;
  tags?: string[];
  images: ProductImage[];
  price: number;
  compareAtPrice?: number;
  currency?: CurrencyCode;
  variants?: ProductVariant[];
  stock: number;
  lowStockThreshold?: number;
  status?: ProductStatus;
  featured?: boolean;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  image?: string;
  parentId?: ID | null;
  isActive?: boolean;
}
export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;

export interface AddToCartDTO {
  productId: ID;
  variantSku?: string;
  quantity: number;
}

export interface CheckoutDTO {
  items: AddToCartDTO[];
  shippingAddress: Address;
  contactEmail: string;
  currency: CurrencyCode;
  paymentProvider?: PaymentProviderName;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  photoURL?: string;
  addresses?: Address[];
}

export interface UpdateUserRoleDTO {
  role: UserRole;
}

/* ────────────────────────────── Auth ───────────────────────────── */

export interface AuthUser extends Pick<User, 'id' | 'email' | 'name' | 'role' | 'photoURL'> {
  firebaseUid: string;
}

export interface SyncUserDTO {
  email: string;
  name?: string;
  photoURL?: string;
}

/* ────────────────────────────── Analytics ───────────────────────────── */

export interface AnalyticsOverview {
  revenue: number;
  revenueDeltaPct: number;
  orders: number;
  ordersDeltaPct: number;
  customers: number;
  customersDeltaPct: number;
  avgOrderValue: number;
  aovDeltaPct: number;
  currency: CurrencyCode;
}

export interface RevenuePoint {
  date: string; // ISO day
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: ID;
  title: string;
  image?: string;
  unitsSold: number;
  revenue: number;
}

export interface OrdersByStatus {
  status: OrderStatus;
  count: number;
}

export interface LowStockItem {
  productId: ID;
  title: string;
  stock: number;
  lowStockThreshold: number;
}

export interface PaymentIntentResult {
  intentId: string;
  status: PaymentStatus;
  provider: PaymentProviderName;
  amount: number;
  currency: CurrencyCode;
  clientSecret?: string; // mock value; real providers return their own
}
