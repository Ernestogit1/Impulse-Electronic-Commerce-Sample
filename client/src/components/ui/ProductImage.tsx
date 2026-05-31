import { useState } from 'react';
import { cn } from '@/lib/cn';

/** <img> with a graceful brand-gradient fallback if the remote photo fails to load. */
export function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950',
          className,
        )}
        aria-label={alt}
      >
        <span className="font-display text-3xl text-gradient-brand opacity-70">Impulse</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt ?? ''}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
