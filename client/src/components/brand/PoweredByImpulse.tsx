import { cn } from '@/lib/cn';

/** Professional attribution shown in the footer, auth pages, and admin sidebar. */
export function PoweredByImpulse({ className }: { className?: string }) {
  return (
    <a
      href="https://impulse.ph"
      target="_blank"
      rel="noreferrer"
      className={cn(
        'group inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-content focus-ring',
        className,
      )}
    >
      <span>Powered by</span>
      <span className="font-semibold text-gradient-brand">Impulse Software Solutions</span>
    </a>
  );
}
