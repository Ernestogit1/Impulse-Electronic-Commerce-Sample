import { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { dismissToast, selectToasts } from '@/features/ui/uiSlice';

/**
 * Renders the ui.toasts queue as stacked, auto-dismissing snackbars.
 * One <Snackbar> per toast (each with a single <Alert> child) — the idiomatic MUI pattern;
 * a Stack nested inside one Snackbar breaks because Snackbar clones its single child.
 */
export function Toaster() {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) => setTimeout(() => dispatch(dismissToast(t.id)), 3800));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dispatch]);

  return (
    <>
      {toasts.map((t, i) => (
        <Snackbar
          key={t.id}
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ mb: `${i * 64}px` }}
        >
          <Alert
            severity={t.variant}
            variant="filled"
            onClose={() => dispatch(dismissToast(t.id))}
            sx={{ borderRadius: 2, alignItems: 'center', boxShadow: 6, minWidth: 280 }}
          >
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
