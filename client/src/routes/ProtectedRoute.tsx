import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

/** Gate for routes that require any signed-in user. */
export function ProtectedRoute() {
  const isAuthed = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  if (!isAuthed) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}
