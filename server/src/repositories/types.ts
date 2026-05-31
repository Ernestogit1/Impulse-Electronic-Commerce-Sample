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

/**
 * Repository interfaces — the data-access seam. Services depend on these, not on Mongoose
 * or any concrete store, so the in-memory (demo) and Mongo (production) implementations are
 * interchangeable behind the factory in ./index.ts.
 */
export interface ProductRepository {
  list(query: ProductQuery): Promise<{ items: Product[]; total: number }>;
  all(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  create(dto: CreateProductDTO): Promise<Product>;
  update(id: string, dto: UpdateProductDTO): Promise<Product | null>;
  remove(id: string): Promise<boolean>;
  decrementStock(id: string, qty: number): Promise<void>;
}

export interface CategoryRepository {
  list(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
}

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  listByUser(userId: string): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  listAll(): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
  count(): Promise<number>;
}

export interface UserRepository {
  upsertByFirebaseUid(firebaseUid: string, data: Partial<User>): Promise<User>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  listAll(): Promise<User[]>;
  updateRole(id: string, role: UserRole): Promise<User | null>;
}

export interface Repositories {
  products: ProductRepository;
  categories: CategoryRepository;
  orders: OrderRepository;
  users: UserRepository;
}
