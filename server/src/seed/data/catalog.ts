import type { Category, Product, CurrencyCode } from '@shared/types';

/** Compact, realistic seed catalog shared by the in-memory store and the Mongo seed script. */
export const seedCategories: Category[] = [
  { id: 'cat-audio', name: 'Audio', slug: 'audio', description: 'Headphones, speakers & earbuds.', image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80', parentId: null, isActive: true },
  { id: 'cat-wearables', name: 'Wearables', slug: 'wearables', description: 'Smartwatches & trackers.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', parentId: null, isActive: true },
  { id: 'cat-workspace', name: 'Workspace', slug: 'workspace', description: 'Keyboards, mice & desk gear.', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80', parentId: null, isActive: true },
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', description: 'Chargers, stands & cables.', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80', parentId: null, isActive: true },
];

interface Seed {
  title: string; brand: string; cat: string; price: number; compareAt?: number;
  stock: number; rating: number; reviews: number; featured?: boolean; photo: string; blurb: string;
}

const SEEDS: Seed[] = [
  { title: 'Aureus One Wireless Headphones', brand: 'Aureus', cat: 'cat-audio', price: 12990, compareAt: 15990, stock: 42, rating: 4.8, reviews: 214, featured: true, photo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', blurb: 'Reference-tuned ANC headphones with 38h battery.' },
  { title: 'Cadence Studio Monitor Speaker', brand: 'Cadence', cat: 'cat-audio', price: 18500, stock: 18, rating: 4.7, reviews: 96, featured: true, photo: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', blurb: 'Two-way active monitor with silk-dome tweeter.' },
  { title: 'Impulse Pulse Pro Earbuds', brand: 'Impulse', cat: 'cat-audio', price: 6490, compareAt: 7990, stock: 73, rating: 4.6, reviews: 312, photo: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', blurb: 'Featherweight buds with spatial audio, 28h case.' },
  { title: 'Vega Chrono Smartwatch', brand: 'Vega', cat: 'cat-wearables', price: 14990, compareAt: 17990, stock: 35, rating: 4.7, reviews: 188, featured: true, photo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', blurb: 'AMOLED, dual-band GPS, 14-day battery.' },
  { title: 'Meridian Active Band', brand: 'Meridian', cat: 'cat-wearables', price: 4990, stock: 64, rating: 4.4, reviews: 142, photo: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6', blurb: 'Slim tracker with SpO2 and 10-day charge.' },
  { title: 'Impulse Keystone Mechanical Keyboard', brand: 'Impulse', cat: 'cat-workspace', price: 8990, compareAt: 10490, stock: 51, rating: 4.9, reviews: 276, featured: true, photo: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', blurb: 'Hot-swap 75% board, gasket mount, PBT caps.' },
  { title: 'Cadence Precision Wireless Mouse', brand: 'Cadence', cat: 'cat-workspace', price: 4490, stock: 88, rating: 4.6, reviews: 201, photo: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', blurb: '26K sensor, silent clicks, 70-day battery.' },
  { title: 'Lumen Task Desk Lamp', brand: 'Lumen', cat: 'cat-workspace', price: 6790, compareAt: 7990, stock: 40, rating: 4.5, reviews: 119, photo: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', blurb: 'Tunable 2700–6500K, flicker-free, USB-C.' },
  { title: 'Impulse GaN 100W Charger', brand: 'Impulse', cat: 'cat-accessories', price: 3290, compareAt: 3990, stock: 120, rating: 4.8, reviews: 298, featured: true, photo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90', blurb: 'Four ports, 100W, pocketable GaN.' },
  { title: 'Cadence Aluminium Laptop Stand', brand: 'Cadence', cat: 'cat-accessories', price: 4290, stock: 57, rating: 4.7, reviews: 144, photo: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', blurb: 'Foldable, heat-venting anodized frame.' },
  { title: 'Vega MagSafe Power Bank 10K', brand: 'Vega', cat: 'cat-accessories', price: 3990, stock: 0, rating: 4.4, reviews: 86, photo: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5', blurb: 'Magnetic charging, soft-touch, USB-C pass-through.' },
  { title: 'Lumen Braided USB-C Cable (2m)', brand: 'Lumen', cat: 'cat-accessories', price: 990, stock: 240, rating: 4.6, reviews: 410, photo: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2', blurb: '240W-rated, double-braided, tangle-free.' },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const seedProducts: Product[] = SEEDS.map((s, i) => {
  const cat = seedCategories.find((c) => c.id === s.cat)!;
  const created = new Date(2025, 0, 1 + i * 3).toISOString();
  return {
    id: `prod-${String(i + 1).padStart(3, '0')}`,
    title: s.title,
    slug: slugify(s.title),
    description: s.blurb,
    brand: s.brand,
    categoryId: cat.id,
    categorySlug: cat.slug,
    categoryName: cat.name,
    tags: [cat.slug, s.brand.toLowerCase()],
    images: [{ url: `${s.photo}?auto=format&fit=crop&w=1000&q=80`, alt: s.title }],
    price: s.price,
    compareAtPrice: s.compareAt,
    currency: 'PHP' as CurrencyCode,
    variants: [],
    stock: s.stock,
    lowStockThreshold: 10,
    status: 'active',
    featured: !!s.featured,
    rating: s.rating,
    reviewCount: s.reviews,
    createdAt: created,
    updatedAt: created,
  };
});
