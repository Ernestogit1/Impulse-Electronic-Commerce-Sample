import { AdminHeader, StatCard } from '@/features/admin/components/StatCard';
import { Badge } from '@/components/ui/Badge';
import { ProductImage } from '@/components/ui/ProductImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { WarehouseOutlined, WarningAmberOutlined, BlockOutlined } from '@mui/icons-material';
import { useGetProductsQuery } from '@/services/api/apiSlice';

export default function AdminInventory() {
  const { data, isLoading } = useGetProductsQuery({ limit: 100, sort: 'newest' });
  const products = data?.items ?? [];

  const totalUnits = products.reduce((n, p) => n + p.stock, 0);
  const low = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const out = products.filter((p) => p.stock === 0);

  return (
    <div>
      <AdminHeader title="Inventory" subtitle="Stock levels and low-stock alerts." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total units in stock" value={totalUnits.toLocaleString()} icon={<WarehouseOutlined fontSize="small" />} loading={isLoading} />
        <StatCard label="Low stock" value={low.length} icon={<WarningAmberOutlined fontSize="small" />} loading={isLoading} />
        <StatCard label="Out of stock" value={out.length} icon={<BlockOutlined fontSize="small" />} loading={isLoading} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4 text-right">Stock</th>
                <th className="p-4 text-right">Threshold</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td className="p-4" colSpan={5}><Skeleton className="h-9 w-full" /></td></tr>
                  ))
                : [...products]
                    .sort((a, b) => a.stock - b.stock)
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <ProductImage src={p.images[0]?.url} alt={p.title} className="h-9 w-9 rounded-lg object-cover" />
                            <span className="line-clamp-1 text-content">{p.title}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs text-muted">{p.id.toUpperCase()}</td>
                        <td className="p-4 text-right font-semibold text-content">{p.stock}</td>
                        <td className="p-4 text-right text-muted">{p.lowStockThreshold}</td>
                        <td className="p-4">
                          {p.stock === 0 ? (
                            <Badge tone="danger">Out of stock</Badge>
                          ) : p.stock <= p.lowStockThreshold ? (
                            <Badge tone="warning">Low</Badge>
                          ) : (
                            <Badge tone="success">Healthy</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
