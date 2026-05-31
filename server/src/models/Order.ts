import { Schema, model, type InferSchemaType } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    image: String,
    sku: String,
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false },
);

const paymentSchema = new Schema(
  {
    provider: { type: String, enum: ['mock', 'stripe', 'paymongo', 'xendit'], default: 'mock' },
    intentId: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['requires_action', 'authorized', 'paid', 'failed', 'refunded'],
      default: 'paid',
    },
    amount: Number,
    currency: { type: String, enum: ['PHP', 'USD'], default: 'PHP' },
  },
  { _id: false },
);

const addressSchema = new Schema(
  {
    label: String,
    fullName: String,
    line1: String,
    line2: String,
    city: String,
    region: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: Number,
    shipping: Number,
    tax: Number,
    discount: { type: Number, default: 0 },
    total: Number,
    currency: { type: String, enum: ['PHP', 'USD'], default: 'PHP' },
    shippingAddress: addressSchema,
    contactEmail: String,
    payment: paymentSchema,
    status: {
      type: String,
      enum: ['pending', 'paid', 'fulfilled', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof orderSchema>;
export const OrderModel = model('Order', orderSchema);
