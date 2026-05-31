import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ReceiptLongOutlined } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProductImage } from '@/components/ui/ProductImage';
import { useAppSelector } from '@/app/hooks';
import { selectAuthUser } from '@/features/auth/authSlice';
import { useGetMyOrdersQuery } from '@/services/api/apiSlice';
import { orderStatusLabel, orderStatusTone } from '@/features/orders/statusTone';
import { formatMoney } from '@/lib/money';

export function OrdersPage() {
  const user = useAppSelector(selectAuthUser);
  const { data: orders, isLoading } = useGetMyOrdersQuery(user?.id ?? '', { skip: !user });

  return (
    <Container className="py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-content">Order history</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          icon={<ReceiptLongOutlined />}
          title="No orders yet"
          description="When you place an order, it will appear here."
          action={
            <Button variant="contained" component={Link} to="/catalog">
              Start shopping
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-content">{o.orderNumber}</span>
                    <Badge tone={orderStatusTone[o.status]}>{orderStatusLabel[o.status]}</Badge>
                  </div>
                  <p className="text-xs text-muted">
                    Placed {new Date(o.placedAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-brand-400">{formatMoney(o.total, o.currency)}</div>
                  <Link to={`/order/${o.id}`} className="text-xs text-muted hover:text-content">
                    View details →
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {o.items.map((it) => (
                  <div key={it.productId} className="flex shrink-0 items-center gap-2 rounded-xl bg-elevated p-2 pr-4">
                    <ProductImage src={it.image} alt={it.title} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm text-content">{it.title}</p>
                      <p className="text-xs text-muted">Qty {it.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
