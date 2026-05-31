import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials, signedOut } from '@/features/auth/authSlice';
import { loadPersistedSession } from '@/features/auth/useAuth';
import { setAuthToken } from '@/lib/apiClient';
import { env } from '@/lib/env';
import { isFirebaseConfigured } from '@/lib/firebase';

/**
 * Restores the session on app load:
 *  - demo mode → rehydrate the persisted demo session from localStorage
 *  - firebase mode → subscribe to onAuthStateChanged and sync the Mongo user
 */
export function SessionBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (env.authMode === 'firebase' && isFirebaseConfigured) {
      let unsub = () => {};
      (async () => {
        const { onAuthStateChanged } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');
        unsub = onAuthStateChanged(auth!, async (fbUser) => {
          if (fbUser) {
            const token = await fbUser.getIdToken();
            setAuthToken(token);
            dispatch(
              setCredentials({
                token,
                user: {
                  id: fbUser.uid,
                  firebaseUid: fbUser.uid,
                  email: fbUser.email ?? '',
                  name: fbUser.displayName ?? (fbUser.email?.split('@')[0] ?? 'Member'),
                  role: 'customer',
                  photoURL: fbUser.photoURL ?? undefined,
                },
              }),
            );
          } else {
            dispatch(signedOut());
          }
        });
      })();
      return () => unsub();
    }

    // demo mode: restore persisted session
    const session = loadPersistedSession();
    if (session) {
      setAuthToken(session.token);
      dispatch(setCredentials(session));
    } else {
      dispatch(signedOut());
    }
  }, [dispatch]);

  return null;
}
