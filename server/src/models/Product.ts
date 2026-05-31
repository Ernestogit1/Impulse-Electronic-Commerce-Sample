import { Schema, model, type InferSchemaType } from 'mongoose';

const variantSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    priceDelta: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
  },
  { _id: false },
);

const imageSchema = new Schema({ url: { type: String, required: true }, alt: String }, { _id: false });

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    brand: String,
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    tags: { type: [String], index: true, default: [] },
    images: { type: [imageSchema], default: [] },
    price: { type: Number, required: true },
    compareAtPrice: Number,
    currency: { type: String, enum: ['PHP', 'USD'], default: 'PHP' },
    variants: { type: [variantSchema], default: [] },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active', index: true },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Full-text search across title/description/tags/brand
productSchema.index({ title: 'text', description: 'text', tags: 'text', brand: 'text' });

export type ProductDoc = InferSchemaType<typeof productSchema>;
export const ProductModel = model('Product', productSchema);
