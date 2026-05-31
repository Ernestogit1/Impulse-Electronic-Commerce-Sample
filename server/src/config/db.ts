import mongoose from 'mongoose';
import { env, useMongo } from './env';

/** Connect to MongoDB when configured. In demo mode this is a no-op (in-memory store). */
export async function connectDatabase(): Promise<void> {
  if (!useMongo) {
    console.log('🗄️  Data: in-memory store (demo mode). Set MONGODB_URI + USE_IN_MEMORY_DB=false for MongoDB.');
    return;
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri);
    console.log('🗄️  Data: connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', (err as Error).message);
    console.error('   Falling back to in-memory data so the server stays up.');
  }
}
