import { repositories } from '@/repositories';
import type { VerifiedToken } from '@/config/firebaseAdmin';

export const authService = {
  /**
   * First-login user sync: upsert a Mongo user keyed by firebaseUid. The password column is
   * ALWAYS the literal placeholder — real credentials live only in Firebase.
   */
  syncUser(token: VerifiedToken) {
    return repositories.users.upsertByFirebaseUid(token.uid, {
      email: token.email ?? `${token.uid}@demo.impulse.ph`,
      name: token.name ?? token.email?.split('@')[0] ?? 'Member',
      photoURL: token.picture,
    });
  },
  findByFirebaseUid(uid: string) {
    return repositories.users.findByFirebaseUid(uid);
  },
};
