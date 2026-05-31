import dotenv from 'dotenv';
dotenv.config();

const bool = (v: string | undefined, fallback: boolean) =>
  v == null ? fallback : v === 'true' || v === '1';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  /** Use the in-memory seeded store instead of MongoDB (demo default). */
  useInMemoryDb: bool(process.env.USE_IN_MEMORY_DB, true),
  mongoUri: process.env.MONGODB_URI ?? '',

  /** 'demo' accepts demo tokens; 'firebase' verifies via the Admin SDK. */
  authMode: (process.env.AUTH_MODE ?? 'demo') as 'demo' | 'firebase',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
  },

  paymentProvider: (process.env.PAYMENT_PROVIDER ?? 'mock') as
    | 'mock'
    | 'stripe'
    | 'paymongo'
    | 'xendit',
  defaultCurrency: (process.env.DEFAULT_CURRENCY ?? 'PHP') as 'PHP' | 'USD',
} as const;

export const useMongo = !env.useInMemoryDb && env.mongoUri.length > 0;
export const useFirebase =
  env.authMode === 'firebase' && env.firebase.projectId.length > 0 && env.firebase.privateKey.length > 0;
