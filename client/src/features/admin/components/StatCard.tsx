import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

export function StatCard({
  label,
  value,
  delta,
  icon,
  loading,
}: {
  label: string;
  value: ReactNode;
  delta?: number;
  icon?: ReactNode;
  loading?: boolean;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        {icon && <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/10 text-brand-400">{icon}</span>}
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-28" />
      ) : (
        <div className="mt-2 font-display text-2xl font-bold text-content">{value}</div>
      )}
      {delta !== undefined && !loading && (
        <div className={cn('mt-1 flex items-center gap-1 text-xs', up ? 'text-emerald-400' : 'text-red-400')}>
          {up ? <TrendingUp fontSize="inherit" /> : <TrendingDown fontSize="inherit" />}
          {Math.abs(delta)}% vs last month
        </div>
      )}
    </div>
  );
}

export function AdminHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-content">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
