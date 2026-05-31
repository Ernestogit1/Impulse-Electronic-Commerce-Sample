/**
 * Demo authentication — lets reviewers explore both customer and admin experiences
 * instantly, with no Firebase project. Mirrors the real auth result shape (AuthUser + token)
 * so the rest of the app is identical in demo and real modes.
 */
import type { AuthUser } from '@shared/types';
import { mockUsers } from '@/services/mock/db/users';

const toAuthUser = (id: string): AuthUser => {
  const u = mockUsers.find((x) => x.id === id)!;
  return { id: u.id, email: u.email, name: u.name, role: u.role, photoURL: u.photoURL, firebaseUid: u.firebaseUid };
};

export const demoAuth = {
  async signInAs(role: 'customer' | 'admin'): Promise<{ user: AuthUser; token: string }> {
    const user = toAuthUser(role === 'admin' ? 'user-admin' : 'user-customer');
    return { user, token: `demo.${user.firebaseUid}.token` };
  },
  /** Email/password in demo mode: map known demo emails, else create a transient customer. */
  async signInWithEmail(email: string): Promise<{ user: AuthUser; token: string }> {
    const known = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const user: AuthUser = known
      ? toAuthUser(known.id)
      : {
          id: `user-${email}`,
          email,
          name: email.split('@')[0].replace(/\W+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          role: 'customer',
          firebaseUid: `demo-${email}`,
        };
    return { user, token: `demo.${user.firebaseUid}.token` };
  },
};
