import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectIsAdmin, selectIsAuthenticated } from '@/features/auth/authSlice';

/** Gate for admin-only routes. Non-admins are redirected to the storefront. */
export function AdminRoute() {
  const isAuthed = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const location = useLocation();
  if (!isAuthed) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
