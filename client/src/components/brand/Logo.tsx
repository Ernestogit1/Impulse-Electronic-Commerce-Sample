import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  to?: string | null;
}

/**
 * Impulse brand mark — the real Impulse Software Solutions logo (a circuit-etched cloud
 * split by a lightning bolt), exported with a transparent background so it sits on any theme.
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/logo-mark.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({ size = 36, withWordmark = true, className, to = '/' }: LogoProps) {
  const content = (
    <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display font-bold tracking-tight text-content" style={{ fontSize: size * 0.5 }}>
            Impulse
          </span>
          <span
            className="font-medium uppercase tracking-[0.22em] text-brand-400"
            style={{ fontSize: size * 0.185 }}
          >
            Software Solutions
          </span>
        </span>
      )}
    </span>
  );
  if (to === null) return content;
  return (
    <Link to={to} className="focus-ring" aria-label="Impulse Storefront — home">
      {content}
    </Link>
  );
}
