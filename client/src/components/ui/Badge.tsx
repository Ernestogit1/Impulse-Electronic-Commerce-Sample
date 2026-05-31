import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Tone = 'brand' | 'neutral' | 'success' | 'danger' | 'warning' | 'info';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30',
  neutral: 'bg-white/5 text-muted ring-1 ring-line',
  success: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  danger: 'bg-red-500/15 text-red-300 ring-1 ring-red-500/30',
  warning: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  info: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
