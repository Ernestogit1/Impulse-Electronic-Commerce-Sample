import { Schema, model, type InferSchemaType } from 'mongoose';

const addressSchema = new Schema(
  {
    label: String,
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    region: String,
    postalCode: { type: String, required: true },
    country: { type: String, default: 'Philippines' },
    phone: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const userSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    photoURL: String,
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: String,
    addresses: { type: [addressSchema], default: [] },
    // Passwords are owned by Firebase Authentication — NEVER store a real password here.
    password: { type: String, default: 'firebase-managed', immutable: true },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const UserModel = model('User', userSchema);
