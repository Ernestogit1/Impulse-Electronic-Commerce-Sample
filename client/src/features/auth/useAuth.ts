/**
 * useAuth — one hook for both demo and Firebase auth. Components never branch on mode.
 */
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  authLoading,
  selectAuthStatus,
  selectAuthUser,
  selectIsAdmin,
  setCredentials,
  signedOut,
} from './authSlice';
import { mergeCart } from '@/features/cart/cartSlice';
import { pushToast } from '@/features/ui/uiSlice';
import { env } from '@/lib/env';
import { isFirebaseConfigured } from '@/lib/firebase';
import { setAuthToken } from '@/lib/apiClient';
import { saveState, loadState } from '@/lib/storage';
import { demoAuth } from './demoAuth';
import type { AuthUser } from '@shared/types';

const AUTH_KEY = 'impulse.auth';
const useFirebase = env.authMode === 'firebase' && isFirebaseConfigured;

type Session = { user: AuthUser; token: string };

function persist(session: Session | null) {
  if (session) saveState(AUTH_KEY, session);
  else saveState(AUTH_KEY, null);
}

export function loadPersistedSession(): Session | null {
  return loadState<Session | null>(AUTH_KEY, null);
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const isAdmin = useAppSelector(selectIsAdmin);

  const apply = useCallback(
    (session: Session, welcome = true) => {
      setAuthToken(session.token);
      dispatch(setCredentials(session));
      persist(session);
      // a logged-in user keeps their guest cart (already in localStorage) — merge keeps it intact
      dispatch(mergeCart([]));
      if (welcome) dispatch(pushToast(`Welcome, ${session.user.name.split(' ')[0]} 👋`, 'success'));
    },
    [dispatch],
  );

  const loginAsDemo = useCallback(
    async (role: 'customer' | 'admin') => {
      dispatch(authLoading());
      apply(await demoAuth.signInAs(role));
    },
    [apply, dispatch],
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      dispatch(authLoading());
      if (useFirebase) {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');
        const cred = await signInWithEmailAndPassword(auth!, email, password);
        const token = await cred.user.getIdToken();
        apply({ user: fromFirebase(cred.user), token });
      } else {
        apply(await demoAuth.signInWithEmail(email));
      }
    },
    [apply, dispatch],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      dispatch(authLoading());
      if (useFirebase) {
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');
        const cred = await createUserWithEmailAndPassword(auth!, email, password);
        await updateProfile(cred.user, { displayName: name });
        const token = await cred.user.getIdToken();
        apply({ user: { ...fromFirebase(cred.user), name }, token });
      } else {
        const session = await demoAuth.signInWithEmail(email);
        apply({ ...session, user: { ...session.user, name } });
      }
    },
    [apply, dispatch],
  );

  const loginWithGoogle = useCallback(async () => {
    dispatch(authLoading());
    if (useFirebase) {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await import('@/lib/firebase');
      const cred = await signInWithPopup(auth!, googleProvider!);
      const token = await cred.user.getIdToken();
      apply({ user: fromFirebase(cred.user), token });
    } else {
      apply(await demoAuth.signInAs('customer'));
    }
  }, [apply, dispatch]);

  const logout = useCallback(async () => {
    if (useFirebase) {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      await signOut(auth!);
    }
    setAuthToken(null);
    persist(null);
    dispatch(signedOut());
    dispatch(pushToast('Signed out', 'info'));
  }, [dispatch]);

  return { user, status, isAdmin, loginAsDemo, loginWithEmail, register, loginWithGoogle, logout };
}

function fromFirebase(u: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }): AuthUser {
  return {
    id: u.uid,
    firebaseUid: u.uid,
    email: u.email ?? '',
    name: u.displayName ?? (u.email ? u.email.split('@')[0] : 'Member'),
    role: 'customer',
    photoURL: u.photoURL ?? undefined,
  };
}
