import type { Product } from '@shared/types';
import { ProductCard } from './ProductCard';
import { Reveal, StaggerGroup } from '@/components/motion/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  loading,
  skeletonCount = 8,
  className,
}: {
  products?: Product[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}) {
  const gridCls = cn(
    'grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4',
    className,
  );

  if (loading) {
    return (
      <div className={gridCls}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <StaggerGroup className={gridCls}>
      {products?.map((p, i) => (
        <Reveal key={p.id} index={i}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </StaggerGroup>
  );
}
