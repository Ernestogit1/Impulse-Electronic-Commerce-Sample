import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {
  ShoppingBagOutlined,
  FavoriteBorder,
  SearchRounded,
  DarkModeOutlined,
  LightModeOutlined,
  MenuRounded,
  PersonOutline,
  AdminPanelSettingsOutlined,
  LogoutOutlined,
  Inventory2Outlined,
} from '@mui/icons-material';
import { Logo } from '@/components/brand/Logo';
import { cn } from '@/lib/cn';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCartCount } from '@/features/cart/cartSlice';
import { selectWishlistCount } from '@/features/wishlist/wishlistSlice';
import { setCartDrawer, setMobileMenu, setSearchOpen, setDisplayCurrency, selectDisplayCurrency } from '@/features/ui/uiSlice';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { useAuth } from '@/features/auth/useAuth';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/catalog' },
  { label: 'Audio', to: '/catalog?category=audio' },
  { label: 'Workspace', to: '/catalog?category=workspace' },
];

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mode, toggle } = useThemeMode();
  const cartCount = useAppSelector(selectCartCount);
  const wishCount = useAppSelector(selectWishlistCount);
  const currency = useAppSelector(selectDisplayCurrency);
  const { user, isAdmin, logout } = useAuth();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-line glass">
      <div className="mx-auto flex h-16 max-w-8xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <IconButton
          aria-label="Open menu"
          className="lg:!hidden"
          onClick={() => dispatch(setMobileMenu(true))}
        >
          <MenuRounded />
        </IconButton>

        <Logo size={34} />

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-white/5 text-content' : 'text-muted hover:text-content',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Tooltip title="Search">
            <IconButton aria-label="Search" onClick={() => dispatch(setSearchOpen(true))}>
              <SearchRounded />
            </IconButton>
          </Tooltip>

          <Tooltip title={`Currency: ${currency}`}>
            <button
              onClick={() => dispatch(setDisplayCurrency(currency === 'PHP' ? 'USD' : 'PHP'))}
              className="hidden h-9 min-w-9 rounded-full px-2 text-sm font-semibold text-muted transition hover:bg-white/5 hover:text-content sm:inline-flex sm:items-center sm:justify-center focus-ring"
              aria-label="Toggle currency"
            >
              {currency === 'PHP' ? '₱' : '$'}
            </button>
          </Tooltip>

          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton aria-label="Toggle theme" onClick={toggle}>
              {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Wishlist">
            <IconButton aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
              <Badge badgeContent={wishCount} color="primary">
                <FavoriteBorder />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Cart">
            <IconButton aria-label="Cart" onClick={() => dispatch(setCartDrawer(true))}>
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingBagOutlined />
              </Badge>
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Tooltip title="Account">
                <IconButton aria-label="Account" onClick={(e) => setAnchor(e.currentTarget)}>
                  <Avatar src={user.photoURL} sx={{ width: 32, height: 32 }}>
                    {user.name.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} keepMounted>
                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-muted">{user.email}</div>
                  </div>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { setAnchor(null); navigate('/profile'); }}>
                  <PersonOutline fontSize="small" className="mr-2" /> Profile
                </MenuItem>
                <MenuItem onClick={() => { setAnchor(null); navigate('/orders'); }}>
                  <Inventory2Outlined fontSize="small" className="mr-2" /> Orders
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={() => { setAnchor(null); navigate('/admin'); }}>
                    <AdminPanelSettingsOutlined fontSize="small" className="mr-2" /> Admin dashboard
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={() => { setAnchor(null); logout(); }}>
                  <LogoutOutlined fontSize="small" className="mr-2" /> Sign out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Tooltip title="Sign in">
              <IconButton aria-label="Sign in" onClick={() => navigate('/login')}>
                <PersonOutline />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}
