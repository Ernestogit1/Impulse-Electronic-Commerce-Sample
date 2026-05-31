import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { CloseRounded } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { PoweredByImpulse } from '@/components/brand/PoweredByImpulse';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setMobileMenu } from '@/features/ui/uiSlice';
import { useGetCategoriesQuery } from '@/services/api/apiSlice';
import { cn } from '@/lib/cn';

export function MobileMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const open = useAppSelector((s) => s.ui.mobileMenuOpen);
  const { data: categories } = useGetCategoriesQuery();
  const close = () => dispatch(setMobileMenu(false));

  const go = (to: string) => {
    close();
    navigate(to);
  };

  return (
    <Drawer anchor="left" open={open} onClose={close} PaperProps={{ sx: { width: 300, bgcolor: 'background.default' } }}>
      <div className="flex items-center justify-between border-b border-line px-4 py-4">
        <Logo size={32} />
        <IconButton onClick={close} aria-label="Close menu">
          <CloseRounded />
        </IconButton>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {[
          ['Home', '/'],
          ['Shop all', '/catalog'],
          ['Wishlist', '/wishlist'],
          ['My orders', '/orders'],
        ].map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={close}
            className={({ isActive }) =>
              cn('rounded-xl px-3 py-2.5 text-sm font-medium', isActive ? 'bg-white/5 text-content' : 'text-muted')
            }
          >
            {label}
          </NavLink>
        ))}
        <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Categories</p>
        {categories?.map((c) => (
          <button
            key={c.id}
            onClick={() => go(`/catalog?category=${c.slug}`)}
            className="rounded-xl px-3 py-2.5 text-left text-sm text-muted hover:text-content"
          >
            {c.name}
          </button>
        ))}
      </nav>
      <div className="mt-auto border-t border-line p-4">
        <PoweredByImpulse />
      </div>
    </Drawer>
  );
}
