import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { MenuRounded, DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { PageTransition } from '@/components/motion/PageTransition';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { useAuth } from '@/features/auth/useAuth';

export function AdminLayout() {
  const location = useLocation();
  const { mode, toggle } = useThemeMode();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen lg:block">
        <AdminSidebar />
      </aside>

      {/* Mobile sidebar */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { border: 0 } }}>
        <AdminSidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line glass px-4 sm:px-6">
          <IconButton className="lg:!hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <MenuRounded />
          </IconButton>
          <div className="font-display font-semibold">Admin Console</div>
          <div className="ml-auto flex items-center gap-2">
            <IconButton onClick={toggle} aria-label="Toggle theme">
              {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
            <div className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3">
              <Avatar src={user?.photoURL} sx={{ width: 28, height: 28 }}>
                {user?.name?.charAt(0) ?? 'A'}
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{user?.name ?? 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
