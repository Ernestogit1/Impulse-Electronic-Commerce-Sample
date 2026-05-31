import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import { CheckCircleRounded } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { ProductImage } from '@/components/ui/ProductImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { useGetOrderQuery } from '@/services/api/apiSlice';
import { formatMoney } from '@/lib/money';

export function OrderConfirmationPage() {
  const { id = '' } = useParams();
  const { data: order, isLoading } = useGetOrderQuery(id);

  if (isLoading)
    return (
      <Container className="py-16">
        <Skeleton className="mx-auto h-40 w-full max-w-2xl rounded-3xl" />
      </Container>
    );

  if (!order)
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Order not found</h1>
        <Button component={Link} to="/orders" variant="contained" sx={{ mt: 3 }}>
          View your orders
        </Button>
      </Container>
    );

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="flex flex-col items-center text-center"
        >
          <CheckCircleRounded sx={{ fontSize: 72 }} className="text-emerald-400" />
          <h1 className="mt-4 font-display text-3xl font-bold text-content">Thank you for your order!</h1>
          <p className="mt-2 text-muted">
            Order <span className="font-semibold text-content">{order.orderNumber}</span> is confirmed. A
            receipt has been sent to {order.contactEmail}.
          </p>
        </motion.div>

        <div className="mt-10 rounded-2xl border border-line bg-surface p-6">
          <div className="divide-y divide-line">
            {order.items.map((it) => (
              <div key={it.productId} className="flex items-center gap-4 py-4">
                <ProductImage src={it.image} alt={it.title} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-content">{it.title}</p>
                  <p className="text-sm text-muted">Qty {it.quantity}</p>
                </div>
                <span className="font-semibold text-content">
                  {formatMoney(it.unitPrice * it.quantity, order.currency)}
                </span>
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <Row label="Subtotal" value={formatMoney(order.subtotal, order.currency)} />
            <Row label="Shipping" value={order.shipping === 0 ? 'Free' : formatMoney(order.shipping, order.currency)} />
            <Row label="Tax" value={formatMoney(order.tax, order.currency)} />
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
              <dt>Total paid</dt>
              <dd className="text-brand-400">{formatMoney(order.total, order.currency)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted">
            Paid via {order.payment.provider} · txn {order.payment.transactionId}
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button component={Link} to="/orders" variant="contained">
            View my orders
          </Button>
          <Button component={Link} to="/catalog" variant="outlined">
            Continue shopping
          </Button>
        </div>
      </div>
    </Container>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="text-content">{value}</dd>
    </div>
  );
}
