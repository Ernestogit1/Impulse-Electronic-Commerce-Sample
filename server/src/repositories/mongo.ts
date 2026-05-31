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
import { ProductModel } from '@/models/Product';
import { CategoryModel } from '@/models/Category';
import { OrderModel } from '@/models/Order';
import { UserModel } from '@/models/User';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ── doc → DTO mappers (the DTO boundary: never leak Mongoose docs to the API) ── */
const toProduct = (d: any): Product => ({
  id: String(d._id),
  title: d.title, slug: d.slug, description: d.description, brand: d.brand,
  categoryId: String(d.category?._id ?? d.category),
  categorySlug: d.category?.slug, categoryName: d.category?.name,
  tags: d.tags ?? [], images: d.images ?? [], price: d.price, compareAtPrice: d.compareAtPrice,
  currency: d.currency, variants: d.variants ?? [], stock: d.stock, lowStockThreshold: d.lowStockThreshold,
  status: d.status, featured: d.featured, rating: d.rating, reviewCount: d.reviewCount,
  createdAt: d.createdAt?.toISOString?.() ?? String(d.createdAt),
  updatedAt: d.updatedAt?.toISOString?.() ?? String(d.updatedAt),
});
const toCategory = (d: any): Category => ({
  id: String(d._id), name: d.name, slug: d.slug, description: d.description, image: d.image,
  parentId: d.parent ? String(d.parent) : null, isActive: d.isActive,
});
const toOrder = (d: any): Order => ({
  id: String(d._id), orderNumber: d.orderNumber, userId: String(d.user), items: d.items,
  subtotal: d.subtotal, shipping: d.shipping, tax: d.tax, discount: d.discount, total: d.total,
  currency: d.currency, shippingAddress: d.shippingAddress, contactEmail: d.contactEmail, payment: d.payment,
  status: d.status, placedAt: d.placedAt?.toISOString?.() ?? String(d.placedAt),
  updatedAt: d.updatedAt?.toISOString?.() ?? String(d.updatedAt),
});
const toUser = (d: any): User => ({
  id: String(d._id), firebaseUid: d.firebaseUid, email: d.email, name: d.name, photoURL: d.photoURL,
  role: d.role, phone: d.phone, addresses: d.addresses ?? [], passwordPlaceholder: 'firebase-managed',
  createdAt: d.createdAt?.toISOString?.() ?? String(d.createdAt),
  updatedAt: d.updatedAt?.toISOString?.() ?? String(d.updatedAt),
});

class MongoProductRepository implements ProductRepository {
  async list(q: ProductQuery) {
    const filter: any = { status: q.status ?? 'active' };
    if (q.q) filter.$text = { $search: q.q };
    if (q.featured) filter.featured = true;
    if (typeof q.minPrice === 'number' || typeof q.maxPrice === 'number') {
      filter.price = {};
      if (typeof q.minPrice === 'number') filter.price.$gte = q.minPrice;
      if (typeof q.maxPrice === 'number') filter.price.$lte = q.maxPrice;
    }
    if (q.category) {
      const cat = await CategoryModel.findOne({ slug: q.category });
      if (cat) filter.category = cat._id;
    }
    const sortMap: Record<string, any> = {
      price_asc: { price: 1 }, price_desc: { price: -1 }, rating: { rating: -1 },
      popular: { reviewCount: -1 }, newest: { createdAt: -1 },
    };
    const page = Math.max(1, q.page ?? 1);
    const limit = q.limit ?? 12;
    const [docs, total] = await Promise.all([
      ProductModel.find(filter).populate('category').sort(sortMap[q.sort ?? 'newest']).skip((page - 1) * limit).limit(limit),
      ProductModel.countDocuments(filter),
    ]);
    return { items: docs.map(toProduct), total };
  }
  async all() { return (await ProductModel.find().populate('category')).map(toProduct); }
  async findBySlug(slug: string) { const d = await ProductModel.findOne({ slug }).populate('category'); return d ? toProduct(d) : null; }
  async findById(id: string) { const d = await ProductModel.findById(id).populate('category'); return d ? toProduct(d) : null; }
  async create(dto: CreateProductDTO) {
    const d = await ProductModel.create({ ...dto, slug: slugify(dto.title) });
    return toProduct(await d.populate('category'));
  }
  async update(id: string, dto: UpdateProductDTO) {
    const patch: any = { ...dto };
    if (dto.title) patch.slug = slugify(dto.title);
    const d = await ProductModel.findByIdAndUpdate(id, patch, { new: true }).populate('category');
    return d ? toProduct(d) : null;
  }
  async remove(id: string) { return !!(await ProductModel.findByIdAndDelete(id)); }
  async decrementStock(id: string, qty: number) { await ProductModel.findByIdAndUpdate(id, { $inc: { stock: -qty } }); }
}

class MongoCategoryRepository implements CategoryRepository {
  async list() {
    const cats = await CategoryModel.find();
    const counts = await ProductModel.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$category', n: { $sum: 1 } } }]);
    const map = new Map(counts.map((c: any) => [String(c._id), c.n]));
    return cats.map((c) => ({ ...toCategory(c), productCount: map.get(String(c._id)) ?? 0 }));
  }
  async findById(id: string) { const d = await CategoryModel.findById(id); return d ? toCategory(d) : null; }
}

class MongoOrderRepository implements OrderRepository {
  async create(order: Order) {
    const d = await OrderModel.create({ ...order, user: order.userId, placedAt: order.placedAt });
    return toOrder(d);
  }
  async listByUser(userId: string) { return (await OrderModel.find({ user: userId }).sort({ placedAt: -1 })).map(toOrder); }
  async findById(id: string) { const d = await OrderModel.findById(id); return d ? toOrder(d) : null; }
  async listAll() { return (await OrderModel.find().sort({ placedAt: -1 })).map(toOrder); }
  async updateStatus(id: string, status: OrderStatus) {
    const d = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
    return d ? toOrder(d) : null;
  }
  async count() { return OrderModel.countDocuments(); }
}

class MongoUserRepository implements UserRepository {
  async upsertByFirebaseUid(firebaseUid: string, data: Partial<User>) {
    const d = await UserModel.findOneAndUpdate(
      { firebaseUid },
      { $setOnInsert: { firebaseUid, password: 'firebase-managed' }, $set: { email: data.email, name: data.name, photoURL: data.photoURL } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    return toUser(d);
  }
  async findByFirebaseUid(firebaseUid: string) { const d = await UserModel.findOne({ firebaseUid }); return d ? toUser(d) : null; }
  async findById(id: string) { const d = await UserModel.findById(id); return d ? toUser(d) : null; }
  async listAll() { return (await UserModel.find().sort({ createdAt: -1 })).map(toUser); }
  async updateRole(id: string, role: UserRole) { const d = await UserModel.findByIdAndUpdate(id, { role }, { new: true }); return d ? toUser(d) : null; }
}

export const mongoRepositories: Repositories = {
  products: new MongoProductRepository(),
  categories: new MongoCategoryRepository(),
  orders: new MongoOrderRepository(),
  users: new MongoUserRepository(),
};
