import { useMongo } from '@/config/env';
import { memoryRepositories } from './memory';
import { mongoRepositories } from './mongo';
import type { Repositories } from './types';

/**
 * Selects the data layer. Demo default = in-memory (seeded, zero setup). With a real
 * MONGODB_URI + USE_IN_MEMORY_DB=false, the SAME service code runs against Mongoose —
 * the repository interface is the only seam that changes.
 */
export const repositories: Repositories = useMongo ? mongoRepositories : memoryRepositories;
export * from './types';
