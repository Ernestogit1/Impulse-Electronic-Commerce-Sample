import { NavLink } from 'react-router-dom';
import {
  SpaceDashboardOutlined,
  Inventory2Outlined,
  CategoryOutlined,
  ReceiptLongOutlined,
  GroupOutlined,
  InsightsOutlined,
  WarehouseOutlined,
  StorefrontOutlined,
} from '@mui/icons-material';
import { Logo } from '@/components/brand/Logo';
import { PoweredByImpulse } from '@/components/brand/PoweredByImpulse';
import { cn } from '@/lib/cn';

const LINKS = [
  { label: 'Dashboard', to: '/admin', icon: SpaceDashboardOutlined, end: true },
  { label: 'Products', to: '/admin/products', icon: Inventory2Outlined },
  { label: 'Categories', to: '/admin/categories', icon: CategoryOutlined },
  { label: 'Orders', to: '/admin/orders', icon: ReceiptLongOutlined },
  { label: 'Customers', to: '/admin/users', icon: GroupOutlined },
  { label: 'Analytics', to: '/admin/analytics', icon: InsightsOutlined },
  { label: 'Inventory', to: '/admin/inventory', icon: WarehouseOutlined },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full w-64 flex-col border-r border-line bg-surface">
      <div className="px-5 py-5">
        <Logo size={32} />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/25' : 'text-muted hover:bg-white/5 hover:text-content',
              )
            }
          >
            <Icon fontSize="small" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-3 border-t border-line p-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-sm text-muted transition hover:text-content"
        >
          <StorefrontOutlined fontSize="small" /> View storefront
        </NavLink>
        <PoweredByImpulse />
      </div>
    </div>
  );
}
