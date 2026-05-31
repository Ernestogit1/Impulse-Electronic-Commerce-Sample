/**
 * Typed, centralized access to client environment configuration.
 * Vite only exposes variables prefixed with VITE_. Everything has a safe default so the
 * app runs with zero configuration (demo mode).
 */
import type { CurrencyCode } from '@shared/types';

const bool = (v: string | undefined, fallback: boolean) =>
  v == null ? fallback : v === 'true' || v === '1';

export const env = {
  /** When true, RTK Query routes to the in-app mock service instead of the network. */
  useMockApi: bool(import.meta.env.VITE_USE_MOCK_API, true),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1',
  /** 'demo' = instant mock sign-in; 'firebase' = real Firebase Auth. */
  authMode: (import.meta.env.VITE_AUTH_MODE ?? 'demo') as 'demo' | 'firebase',
  defaultCurrency: (import.meta.env.VITE_DEFAULT_CURRENCY ?? 'PHP') as CurrencyCode,
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  },
} as const;

/** True only when real Firebase web credentials are present AND auth mode is firebase. */
export const isFirebaseConfigured =
  env.authMode === 'firebase' && env.firebase.apiKey.length > 0 && env.firebase.projectId.length > 0;
