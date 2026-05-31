import { randomUUID } from 'node:crypto';
import type {
  Category,
  CreateProductDTO,
  Order,
  OrderStatus,
  Product,
  ProductQuery,
  UpdateProductDTO,
  User,
  UserRole,
} from '@shared/types';
import type {
  CategoryRepository,
  OrderRepository,
  ProductRepository,
  Repositories,
  UserRepository,
} from './types';
import { seedCategories, seedProducts } from '@/seed/data/catalog';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const store = {
  products: clone(seedProducts) as Product[],
  categories: clone(seedCategories) as Category[],
  orders: [] as Order[],
  users: [
    {
      id: 'user-admin', firebaseUid: 'demo-admin-uid', email: 'admin@impulse.ph', name: 'Impulse Admin',
      role: 'admin' as UserRole, addresses: [], passwordPlaceholder: 'firebase-managed' as const,
      createdAt: new Date(2025, 0, 2).toISOString(), updatedAt: new Date(2025, 0, 2).toISOString(),
    },
    {
      id: 'user-customer', firebaseUid: 'demo-customer-uid', email: 'customer@impulse.ph', name: 'Maria Santos',
      role: 'customer' as UserRole, addresses: [], passwordPlaceholder: 'firebase-managed' as const,
      createdAt: new Date(2025, 1, 12).toISOString(), updatedAt: new Date(2025, 1, 12).toISOString(),
    },
  ] as User[],
};

class MemoryProductRepository implements ProductRepository {
  async list(q: ProductQuery) {
    let items = store.products.filter((p) => p.status === (q.status ?? 'active'));
    if (q.q) {
      const n = q.q.toLowerCase();
      items = items.filter(
        (p) => p.title.toLowerCase().includes(n) || p.description.toLowerCase().includes(n) || p.tags.some((t) => t.includes(n)),
      );
    }
    if (q.category) items = items.filter((p) => p.categorySlug === q.category);
    if (q.featured) items = items.filter((p) => p.featured);
    if (typeof q.minPrice === 'number') items = items.filter((p) => p.price >= q.minPrice!);
    if (typeof q.maxPrice === 'number') items = items.filter((p) => p.price <= q.maxPrice!);
    switch (q.sort) {
      case 'price_asc': items.sort((a, b) => a.price - b.price); break;
      case 'price_desc': items.sort((a, b) => b.price - a.price); break;
      case 'rating': items.sort((a, b) => b.rating - a.rating); break;
      case 'popular': items.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default: items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    const total = items.length;
    const page = Math.max(1, q.page ?? 1);
    const limit = q.limit ?? 12;
    return { items: items.slice((page - 1) * limit, page * limit), total };
  }
  async all() { return store.products; }
  async findBySlug(slug: string) { return store.products.find((p) => p.slug === slug) ?? null; }
  async findById(id: string) { return store.products.find((p) => p.id === id) ?? null; }
  async create(dto: CreateProductDTO) {
    const cat = store.categories.find((c) => c.id === dto.categoryId);
    const now = new Date().toISOString();
    const product: Product = {
      id: `prod-${randomUUID().slice(0, 6)}`, title: dto.title, slug: slugify(dto.title), description: dto.description,
      brand: dto.brand, categoryId: dto.categoryId, categorySlug: cat?.slug, categoryName: cat?.name,
      tags: dto.tags ?? [], images: dto.images, price: dto.price, compareAtPrice: dto.compareAtPrice,
      currency: dto.currency ?? 'PHP', variants: dto.variants ?? [], stock: dto.stock,
      lowStockThreshold: dto.lowStockThreshold ?? 10, status: dto.status ?? 'active', featured: dto.featured ?? false,
      rating: 0, reviewCount: 0, createdAt: now, updatedAt: now,
    };
    store.products.unshift(product);
    return product;
  }
  async update(id: string, dto: UpdateProductDTO) {
    const p = store.products.find((x) => x.id === id);
    if (!p) return null;
    Object.assign(p, dto, { updatedAt: new Date().toISOString() });
    if (dto.title) p.slug = slugify(dto.title);
    if (dto.categoryId) {
      const cat = store.categories.find((c) => c.id === dto.categoryId);
      p.categorySlug = cat?.slug; p.categoryName = cat?.name;
    }
    return p;
  }
  async remove(id: string) {
    const before = store.products.length;
    store.products = store.products.filter((p) => p.id !== id);
    return store.products.length < before;
  }
  async decrementStock(id: string, qty: number) {
    const p = store.products.find((x) => x.id === id);
    if (p) p.stock = Math.max(0, p.stock - qty);
  }
}

class MemoryCategoryRepository implements CategoryRepository {
  async list() {
    return store.categories.map((c) => ({
      ...c,
      productCount: store.products.filter((p) => p.categoryId === c.id && p.status === 'active').length,
    }));
  }
  async findById(id: string) { return store.categories.find((c) => c.id === id) ?? null; }
}

class MemoryOrderRepository implements OrderRepository {
  async create(order: Order) { store.orders.unshift(order); return order; }
  async listByUser(userId: string) { return store.orders.filter((o) => o.userId === userId); }
  async findById(id: string) { return store.orders.find((o) => o.id === id) ?? null; }
  async listAll() { return store.orders; }
  async updateStatus(id: string, status: OrderStatus) {
    const o = store.orders.find((x) => x.id === id);
    if (!o) return null;
    o.status = status; o.updatedAt = new Date().toISOString();
    return o;
  }
  async count() { return store.orders.length; }
}

class MemoryUserRepository implements UserRepository {
  async upsertByFirebaseUid(firebaseUid: string, data: Partial<User>) {
    let u = store.users.find((x) => x.firebaseUid === firebaseUid);
    const now = new Date().toISOString();
    if (!u) {
      u = {
        id: `user-${randomUUID().slice(0, 6)}`, firebaseUid, email: data.email ?? '', name: data.name ?? 'Member',
        photoURL: data.photoURL, role: 'customer', addresses: [], passwordPlaceholder: 'firebase-managed',
        createdAt: now, updatedAt: now,
      };
      store.users.push(u);
    } else {
      Object.assign(u, { ...data, updatedAt: now });
    }
    return u;
  }
  async findByFirebaseUid(firebaseUid: string) { return store.users.find((u) => u.firebaseUid === firebaseUid) ?? null; }
  async findById(id: string) { return store.users.find((u) => u.id === id) ?? null; }
  async listAll() { return store.users; }
  async updateRole(id: string, role: UserRole) {
    const u = store.users.find((x) => x.id === id);
    if (!u) return null;
    u.role = role; return u;
  }
}

export const memoryRepositories: Repositories = {
  products: new MemoryProductRepository(),
  categories: new MemoryCategoryRepository(),
  orders: new MemoryOrderRepository(),
  users: new MemoryUserRepository(),
};
