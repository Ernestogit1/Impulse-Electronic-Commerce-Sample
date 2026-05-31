import type {
  AnalyticsOverview,
  AuthUser,
  Category,
  CheckoutDTO,
  CreateProductDTO,
  LowStockItem,
  Order,
  OrderItem,
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
import { db, latency, nextId, slugify } from './store';

const REVENUE_STATUSES: OrderStatus[] = ['paid', 'fulfilled', 'completed'];

function applyQuery(list: Product[], q: ProductQuery): Product[] {
  const wantStatus = q.status ?? 'active';
  let out: Product[] = list.filter((p) => p.status === wantStatus);
  if (q.q) {
    const needle = q.q.toLowerCase();
    out = out.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        (p.brand?.toLowerCase().includes(needle) ?? false) ||
        p.tags.some((t) => t.includes(needle)),
    );
  }
  if (q.category) out = out.filter((p) => p.categorySlug === q.category);
  if (q.featured) out = out.filter((p) => p.featured);
  const { minPrice, maxPrice, tags } = q;
  if (typeof minPrice === 'number') out = out.filter((p) => p.price >= minPrice);
  if (typeof maxPrice === 'number') out = out.filter((p) => p.price <= maxPrice);
  if (tags?.length) out = out.filter((p) => tags.some((t) => p.tags.includes(t)));

  switch (q.sort) {
    case 'price_asc':
      out.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      out.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      out.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
      out.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  return out;
}

export const mockService: DataApi = {
  async listProducts(query) {
    await latency();
    const filtered = applyQuery(db.products, query);
    const page = Math.max(1, query.page ?? 1);
    const limit = query.limit ?? 12;
    const total = filtered.length;
    const items = filtered.slice((page - 1) * limit, page * limit);
    const result: Paginated<Product> = {
      items,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
    return result;
  },

  async getProductBySlug(slug) {
    await latency();
    const product = db.products.find((p) => p.slug === slug);
    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  },

  async listCategories() {
    await latency(120, 280);
    return db.categories.map((c) => ({
      ...c,
      productCount: db.products.filter((p) => p.categoryId === c.id && p.status === 'active').length,
    })) as Category[];
  },

  async createProduct(dto: CreateProductDTO) {
    await latency();
    const cat = db.categories.find((c) => c.id === dto.categoryId);
    const now = new Date().toISOString();
    const product: Product = {
      id: nextId('prod'),
      title: dto.title,
      slug: slugify(dto.title),
      description: dto.description,
      brand: dto.brand,
      categoryId: dto.categoryId,
      categorySlug: cat?.slug,
      categoryName: cat?.name,
      tags: dto.tags ?? [],
      images: dto.images,
      price: dto.price,
      compareAtPrice: dto.compareAtPrice,
      currency: dto.currency ?? 'PHP',
      variants: dto.variants ?? [],
      stock: dto.stock,
      lowStockThreshold: dto.lowStockThreshold ?? 10,
      status: dto.status ?? 'active',
      featured: dto.featured ?? false,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    db.products.unshift(product);
    return product;
  },

  async updateProduct(id, dto: UpdateProductDTO) {
    await latency();
    const product = db.products.find((p) => p.id === id);
    if (!product) throw { status: 404, message: 'Product not found' };
    Object.assign(product, dto, { updatedAt: new Date().toISOString() });
    if (dto.title) product.slug = slugify(dto.title);
    if (dto.categoryId) {
      const cat = db.categories.find((c) => c.id === dto.categoryId);
      product.categorySlug = cat?.slug;
      product.categoryName = cat?.name;
    }
    return product;
  },

  async deleteProduct(id) {
    await latency();
    db.products = db.products.filter((p) => p.id !== id);
    return { id };
  },

  async checkout(dto: CheckoutDTO, user: AuthUser) {
    await latency(500, 1100); // payment processing feel
    const items: OrderItem[] = dto.items.map((line) => {
      const p = db.products.find((x) => x.id === line.productId);
      if (!p) throw { status: 400, message: `Unknown product ${line.productId}` };
      if (p.stock < line.quantity) throw { status: 409, message: `${p.title} is out of stock` };
      p.stock -= line.quantity; // decrement inventory
      return {
        productId: p.id,
        title: p.title,
        image: p.images[0]?.url,
        sku: line.variantSku,
        unitPrice: p.price,
        quantity: line.quantity,
      };
    });
    const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const shipping = subtotal > 10000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + shipping + tax;
    const now = new Date().toISOString();
    const order: Order = {
      id: nextId('order'),
      orderNumber: `IMP-${10300 + db.orders.length}`,
      userId: user.id,
      items,
      subtotal,
      shipping,
      tax,
      discount: 0,
      total,
      currency: dto.currency,
      shippingAddress: dto.shippingAddress,
      contactEmail: dto.contactEmail,
      payment: {
        provider: dto.paymentProvider ?? 'mock',
        intentId: `pi_mock_${nextId('')}`,
        transactionId: `txn_${nextId('')}`,
        status: 'paid',
        amount: total,
        currency: dto.currency,
      },
      status: 'paid',
      placedAt: now,
      updatedAt: now,
    };
    db.orders.unshift(order);
    return order;
  },

  async listMyOrders(userId) {
    await latency();
    return db.orders.filter((o) => o.userId === userId);
  },

  async getOrder(id) {
    await latency();
    const order = db.orders.find((o) => o.id === id);
    if (!order) throw { status: 404, message: 'Order not found' };
    return order;
  },

  async adminListOrders() {
    await latency();
    return [...db.orders];
  },

  async adminUpdateOrderStatus(id, status) {
    await latency();
    const order = db.orders.find((o) => o.id === id);
    if (!order) throw { status: 404, message: 'Order not found' };
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  },

  async adminListUsers() {
    await latency();
    return [...db.users];
  },

  async adminUpdateUserRole(id, role: UserRole) {
    await latency();
    const user = db.users.find((u) => u.id === id);
    if (!user) throw { status: 404, message: 'User not found' };
    user.role = role;
    return user;
  },

  async analyticsOverview() {
    await latency();
    const paid = db.orders.filter((o) => REVENUE_STATUSES.includes(o.status));
    const revenue = paid.reduce((s, o) => s + o.total, 0);
    const orders = db.orders.length;
    const customers = new Set(db.orders.map((o) => o.userId)).size;
    const aov = paid.length ? Math.round(revenue / paid.length) : 0;
    const result: AnalyticsOverview = {
      revenue,
      revenueDeltaPct: 12.4,
      orders,
      ordersDeltaPct: 8.1,
      customers,
      customersDeltaPct: 5.2,
      avgOrderValue: aov,
      aovDeltaPct: 3.7,
      currency: 'PHP',
    };
    return result;
  },

  async revenueSeries() {
    await latency();
    const days = 14;
    const series: RevenuePoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = new Date(Date.now() - i * 86_400_000);
      const iso = day.toISOString().slice(0, 10);
      const dayOrders = db.orders.filter(
        (o) => o.placedAt.slice(0, 10) === iso && REVENUE_STATUSES.includes(o.status),
      );
      const base = 8000 + Math.round(Math.abs(Math.sin(i * 1.3)) * 22000);
      series.push({
        date: iso,
        revenue: base + dayOrders.reduce((s, o) => s + o.total, 0),
        orders: 2 + (i % 4) + dayOrders.length,
      });
    }
    return series;
  },

  async topProducts() {
    await latency();
    const tally = new Map<string, TopProduct>();
    for (const o of db.orders) {
      if (!REVENUE_STATUSES.includes(o.status)) continue;
      for (const it of o.items) {
        const cur = tally.get(it.productId) ?? {
          productId: it.productId,
          title: it.title,
          image: it.image,
          unitsSold: 0,
          revenue: 0,
        };
        cur.unitsSold += it.quantity;
        cur.revenue += it.unitPrice * it.quantity;
        tally.set(it.productId, cur);
      }
    }
    return [...tally.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  },

  async ordersByStatus() {
    await latency();
    const statuses: OrderStatus[] = [
      'pending',
      'paid',
      'fulfilled',
      'completed',
      'cancelled',
      'refunded',
    ];
    return statuses.map<OrdersByStatus>((status) => ({
      status,
      count: db.orders.filter((o) => o.status === status).length,
    }));
  },

  async lowStock() {
    await latency();
    return db.products
      .filter((p) => p.stock <= p.lowStockThreshold)
      .sort((a, b) => a.stock - b.stock)
      .map<LowStockItem>((p) => ({
        productId: p.id,
        title: p.title,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
      }));
  },
};
