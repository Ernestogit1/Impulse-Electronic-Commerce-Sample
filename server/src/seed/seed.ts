/**
 * Seeds MongoDB with the demo catalog + accounts. Run: `npm run seed` (server workspace).
 * Requires MONGODB_URI. Safe to re-run — it clears the seeded collections first.
 */
import mongoose from 'mongoose';
import { env } from '@/config/env';
import { CategoryModel } from '@/models/Category';
import { ProductModel } from '@/models/Product';
import { UserModel } from '@/models/User';
import { seedCategories, seedProducts } from './data/catalog';

async function run() {
  if (!env.mongoUri) {
    console.error('❌ MONGODB_URI is required to seed. Set it in server/.env');
    process.exit(1);
  }
  await mongoose.connect(env.mongoUri);
  console.log('Connected. Seeding…');

  await Promise.all([CategoryModel.deleteMany({}), ProductModel.deleteMany({})]);

  // categories (map seed string ids → Mongo _ids)
  const catIdBySlug = new Map<string, mongoose.Types.ObjectId>();
  for (const c of seedCategories) {
    const doc = await CategoryModel.create({
      name: c.name, slug: c.slug, description: c.description, image: c.image, isActive: c.isActive,
    });
    catIdBySlug.set(c.slug, doc._id);
  }

  for (const p of seedProducts) {
    await ProductModel.create({
      title: p.title, slug: p.slug, description: p.description, brand: p.brand,
      category: catIdBySlug.get(p.categorySlug!),
      tags: p.tags, images: p.images, price: p.price, compareAtPrice: p.compareAtPrice, currency: p.currency,
      stock: p.stock, lowStockThreshold: p.lowStockThreshold, status: p.status, featured: p.featured,
      rating: p.rating, reviewCount: p.reviewCount,
    });
  }

  // demo accounts (passwords are firebase-managed)
  await UserModel.updateOne(
    { firebaseUid: 'demo-admin-uid' },
    { $set: { email: 'admin@impulse.ph', name: 'Impulse Admin', role: 'admin', password: 'firebase-managed' } },
    { upsert: true },
  );
  await UserModel.updateOne(
    { firebaseUid: 'demo-customer-uid' },
    { $set: { email: 'customer@impulse.ph', name: 'Maria Santos', role: 'customer', password: 'firebase-managed' } },
    { upsert: true },
  );

  console.log(`✅ Seeded ${seedCategories.length} categories, ${seedProducts.length} products, 2 demo users.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
