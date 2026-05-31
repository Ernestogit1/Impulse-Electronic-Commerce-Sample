import type { Product, ProductImage } from '@shared/types';
import { mockCategories } from './categories';

const catName = (id: string) => mockCategories.find((c) => c.id === id)?.name ?? '';
const catSlug = (id: string) => mockCategories.find((c) => c.id === id)?.slug ?? '';

const img = (url: string, alt: string): ProductImage => ({
  url: `${url}?auto=format&fit=crop&w=1000&q=80`,
  alt,
});

interface Seed {
  title: string;
  brand: string;
  categoryId: string;
  tags: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  photo: string;
  blurb: string;
}

const SEEDS: Seed[] = [
  // ── Audio ──
  { title: 'Aureus One Wireless Headphones', brand: 'Aureus', categoryId: 'cat-audio', tags: ['headphones', 'wireless', 'noise-cancelling'], price: 12990, compareAtPrice: 15990, stock: 42, rating: 4.8, reviewCount: 214, featured: true, photo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', blurb: 'Reference-tuned 40mm drivers, adaptive hybrid noise cancellation, and 38 hours of play. Memory-foam earcups wrapped in vegan leather for all-day sessions.' },
  { title: 'Cadence Studio Monitor Speaker', brand: 'Cadence', categoryId: 'cat-audio', tags: ['speaker', 'studio', 'bluetooth'], price: 18500, stock: 18, rating: 4.7, reviewCount: 96, featured: true, photo: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', blurb: 'A two-way active monitor with a silk-dome tweeter and woven mid-bass driver. Flat, honest sound for mixing — beautiful enough for the shelf.' },
  { title: 'Impulse Pulse Pro Earbuds', brand: 'Impulse', categoryId: 'cat-audio', tags: ['earbuds', 'wireless', 'sport'], price: 6490, compareAtPrice: 7990, stock: 73, rating: 4.6, reviewCount: 312, photo: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', blurb: 'Featherweight buds with spatial audio, IPX5 sweat resistance, and a pocketable charging case good for 28 hours.' },
  { title: 'Northwind Vinyl Turntable', brand: 'Northwind', categoryId: 'cat-audio', tags: ['turntable', 'analog', 'home'], price: 22900, stock: 9, rating: 4.9, reviewCount: 54, photo: 'https://images.unsplash.com/photo-1542208998-f6dbbb27a3a4', blurb: 'Belt-driven precision with a carbon tonearm and walnut plinth. Warm analog character, engineered to last decades.' },
  // ── Wearables ──
  { title: 'Vega Chrono Smartwatch', brand: 'Vega', categoryId: 'cat-wearables', tags: ['smartwatch', 'fitness', 'amoled'], price: 14990, compareAtPrice: 17990, stock: 35, rating: 4.7, reviewCount: 188, featured: true, photo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', blurb: 'A 1.4" always-on AMOLED, dual-band GPS, and 14-day battery in a surgical-steel case. Health insights that actually help.' },
  { title: 'Meridian Active Band', brand: 'Meridian', categoryId: 'cat-wearables', tags: ['tracker', 'fitness', 'lightweight'], price: 4990, stock: 64, rating: 4.4, reviewCount: 142, photo: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6', blurb: 'Slim 24/7 tracker with SpO2, sleep staging, and a 10-day charge. Swim-proof and barely there on the wrist.' },
  { title: 'Aureus Field Watch Hybrid', brand: 'Aureus', categoryId: 'cat-wearables', tags: ['hybrid', 'analog', 'premium'], price: 19990, stock: 14, rating: 4.8, reviewCount: 67, photo: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56', blurb: 'Mechanical hands over a hidden smart core. Sapphire crystal, 100m water resistance, and quiet notifications.' },
  // ── Workspace ──
  { title: 'Impulse Keystone Mechanical Keyboard', brand: 'Impulse', categoryId: 'cat-workspace', tags: ['keyboard', 'mechanical', 'hotswap'], price: 8990, compareAtPrice: 10490, stock: 51, rating: 4.9, reviewCount: 276, featured: true, photo: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', blurb: 'A hot-swappable 75% board with gasket mounting, doubleshot PBT keycaps, and a milled aluminium frame. Types like butter.' },
  { title: 'Cadence Precision Wireless Mouse', brand: 'Cadence', categoryId: 'cat-workspace', tags: ['mouse', 'wireless', 'ergonomic'], price: 4490, stock: 88, rating: 4.6, reviewCount: 201, photo: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', blurb: 'A 26K optical sensor, silent clicks, and a sculpted shell that disappears into your hand. 70-day battery.' },
  { title: 'Northwind Oak Desk Shelf', brand: 'Northwind', categoryId: 'cat-workspace', tags: ['desk', 'wood', 'organizer'], price: 5990, stock: 27, rating: 4.7, reviewCount: 73, photo: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd', blurb: 'Solid oak monitor riser that lifts your screen to eye level and hides the clutter beneath. Cable-friendly.' },
  { title: 'Lumen Task Desk Lamp', brand: 'Lumen', categoryId: 'cat-workspace', tags: ['lamp', 'lighting', 'led'], price: 6790, compareAtPrice: 7990, stock: 40, rating: 4.5, reviewCount: 119, photo: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', blurb: 'Tunable 2700–6500K light with flicker-free dimming and a USB-C pass-through. Minimal aluminium arm.' },
  // ── Smart Home ──
  { title: 'Lumen Halo Ambient Light', brand: 'Lumen', categoryId: 'cat-smart-home', tags: ['lighting', 'smart', 'rgb'], price: 7490, stock: 33, rating: 4.6, reviewCount: 154, featured: true, photo: 'https://images.unsplash.com/photo-1558002038-1055907df827', blurb: '16M colors, music-reactive scenes, and voice control. Wraps any room in cinematic ambient glow.' },
  { title: 'Meridian Home Hub', brand: 'Meridian', categoryId: 'cat-smart-home', tags: ['hub', 'smart', 'matter'], price: 9990, stock: 21, rating: 4.5, reviewCount: 88, photo: 'https://images.unsplash.com/photo-1593784991095-a205069470b6', blurb: 'A Matter-ready hub that unifies your devices with local-first automations and a calm, glanceable display.' },
  { title: 'Lumen Sunrise Smart Clock', brand: 'Lumen', categoryId: 'cat-smart-home', tags: ['clock', 'smart', 'wake'], price: 5490, stock: 46, rating: 4.4, reviewCount: 102, photo: 'https://images.unsplash.com/photo-1512446816042-444d641267d4', blurb: 'Wake to a simulated sunrise and drift off to soundscapes. A warm, screen-light alternative to your phone.' },
  // ── Bags & Carry ──
  { title: 'Northwind Transit Backpack 22L', brand: 'Northwind', categoryId: 'cat-carry', tags: ['backpack', 'travel', 'water-resistant'], price: 8490, compareAtPrice: 9990, stock: 38, rating: 4.8, reviewCount: 167, featured: true, photo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', blurb: 'A weatherproof commuter pack with a 16" laptop sleeve, magnetic straps, and a luggage pass-through.' },
  { title: 'Aureus Leather Folio', brand: 'Aureus', categoryId: 'cat-carry', tags: ['folio', 'leather', 'premium'], price: 6990, stock: 24, rating: 4.7, reviewCount: 59, photo: 'https://images.unsplash.com/photo-1547949003-9792a18a2601', blurb: 'Full-grain leather that ages beautifully. Holds a tablet, documents, and the essentials — nothing more.' },
  { title: 'Impulse Tech Sling', brand: 'Impulse', categoryId: 'cat-carry', tags: ['sling', 'compact', 'everyday'], price: 3490, stock: 70, rating: 4.5, reviewCount: 131, photo: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3', blurb: 'A streamlined sling for your phone, cables, and power bank. Lined pockets keep gear scratch-free.' },
  // ── Accessories ──
  { title: 'Impulse GaN 100W Charger', brand: 'Impulse', categoryId: 'cat-accessories', tags: ['charger', 'gan', 'usb-c'], price: 3290, compareAtPrice: 3990, stock: 120, rating: 4.8, reviewCount: 298, featured: true, photo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90', blurb: 'Four ports, 100W total, and pocketable thanks to GaN. Charges a laptop and three devices at once.' },
  { title: 'Cadence Aluminium Laptop Stand', brand: 'Cadence', categoryId: 'cat-accessories', tags: ['stand', 'aluminium', 'ergonomic'], price: 4290, stock: 57, rating: 4.7, reviewCount: 144, photo: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', blurb: 'Raises your laptop to a healthier height with a heat-venting, foldable anodized frame.' },
  { title: 'Vega MagSafe Power Bank 10K', brand: 'Vega', categoryId: 'cat-accessories', tags: ['power-bank', 'magsafe', 'wireless'], price: 3990, stock: 0, rating: 4.4, reviewCount: 86, photo: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5', blurb: 'Snap-on magnetic charging with a soft-touch finish and a pass-through USB-C. Tops up on the go.' },
  { title: 'Lumen Braided USB-C Cable (2m)', brand: 'Lumen', categoryId: 'cat-accessories', tags: ['cable', 'usb-c', 'braided'], price: 990, stock: 240, rating: 4.6, reviewCount: 410, photo: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2', blurb: '240W-rated, double-braided, and tangle-free. The last charging cable you’ll need to buy.' },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const mockProducts: Product[] = SEEDS.map((s, i) => {
  const slug = slugify(s.title);
  const created = new Date(2025, 0, 1 + i * 3).toISOString();
  return {
    id: `prod-${String(i + 1).padStart(3, '0')}`,
    title: s.title,
    slug,
    description: s.blurb,
    brand: s.brand,
    categoryId: s.categoryId,
    categorySlug: catSlug(s.categoryId),
    categoryName: catName(s.categoryId),
    tags: s.tags,
    images: [img(s.photo, s.title)],
    price: s.price,
    compareAtPrice: s.compareAtPrice,
    currency: 'PHP',
    variants: [],
    stock: s.stock,
    lowStockThreshold: 10,
    status: 'active',
    featured: !!s.featured,
    rating: s.rating,
    reviewCount: s.reviewCount,
    createdAt: created,
    updatedAt: created,
  };
});
