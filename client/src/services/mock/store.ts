/**
 * In-memory mock database. Holds mutable clones of the seed data so that admin CRUD,
 * checkout, and inventory changes persist for the lifetime of the session — making the
 * frontend fully interactive with zero backend.
 */
import type { Category, Order, Product, User } from '@shared/types';
import { mockProducts } from './db/products';
import { mockCategories } from './db/categories';
import { mockOrders } from './db/orders';
import { mockDirectory } from './db/users';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export const db = {
  products: clone(mockProducts) as Product[],
  categories: clone(mockCategories) as Category[],
  orders: clone(mockOrders) as Order[],
  users: clone(mockDirectory) as User[],
};

/** Simulate realistic network latency so skeleton loaders actually show. */
export const latency = (min = 280, max = 620) =>
  new Promise<void>((res) => setTimeout(res, min + Math.random() * (max - min)));

export const nextId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
