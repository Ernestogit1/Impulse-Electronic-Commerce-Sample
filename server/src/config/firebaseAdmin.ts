import { env, useFirebase } from './env';

/**
 * Firebase Admin — lazy init, guarded. In demo mode it is not loaded; verifyToken
 * accepts demo tokens so the API works with no Firebase project.
 */
let adminAuth: import('firebase-admin/auth').Auth | null = null;

export async function initFirebaseAdmin(): Promise<void> {
  if (!useFirebase) {
    console.log('🔐 Auth: demo mode (mock token verification). Set AUTH_MODE=firebase + service account for real auth.');
    return;
  }
  const { initializeApp, cert, getApps } = await import('firebase-admin/app');
  const { getAuth } = await import('firebase-admin/auth');
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: env.firebase.projectId,
        clientEmail: env.firebase.clientEmail,
        privateKey: env.firebase.privateKey,
      }),
    });
  }
  adminAuth = getAuth();
  console.log('🔐 Auth: Firebase Admin initialized');
}

export interface VerifiedToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

/** Verify a bearer token. Demo mode decodes `demo.<uid>.token`; firebase mode verifies the JWT. */
export async function verifyToken(token: string): Promise<VerifiedToken> {
  if (useFirebase && adminAuth) {
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email, name: decoded.name, picture: decoded.picture };
  }
  // demo token format: demo.<firebaseUid>.token
  const parts = token.split('.');
  if (parts[0] === 'demo' && parts[1]) {
    const uid = parts[1];
    const known: Record<string, { email: string; name: string }> = {
      'demo-admin-uid': { email: 'admin@impulse.ph', name: 'Impulse Admin' },
      'demo-customer-uid': { email: 'customer@impulse.ph', name: 'Maria Santos' },
    };
    return { uid, ...(known[uid] ?? { email: `${uid}@demo.impulse.ph`, name: 'Demo User' }) };
  }
  throw new Error('Invalid token');
}
