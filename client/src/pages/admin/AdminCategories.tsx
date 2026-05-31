import { AdminHeader } from '@/features/admin/components/StatCard';
import { Badge } from '@/components/ui/Badge';
import { ProductImage } from '@/components/ui/ProductImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { useGetCategoriesQuery } from '@/services/api/apiSlice';

export default function AdminCategories() {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  return (
    <div>
      <AdminHeader title="Categories" subtitle={`${categories?.length ?? 0} collections`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)
          : categories?.map((c) => (
              <div key={c.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="relative h-28">
                  <ProductImage src={c.image} alt={c.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-3 flex items-center gap-2">
                    <span className="font-display font-semibold text-white">{c.name}</span>
                    {c.isActive && <Badge tone="success">Active</Badge>}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4">
                  <p className="line-clamp-1 text-sm text-muted">{c.description}</p>
                  <Badge tone="brand">{c.productCount} items</Badge>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
