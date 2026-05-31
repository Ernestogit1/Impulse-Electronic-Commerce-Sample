import type { ReactNode } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectDisplayCurrency } from '@/features/ui/uiSlice';
import { formatMoney, convert } from '@/lib/money';

/** Computes shipping/tax/total from a PHP subtotal and renders the summary box. */
export function computeTotals(subtotalPhp: number) {
  const shipping = subtotalPhp > 10000 || subtotalPhp === 0 ? 0 : 150;
  const tax = Math.round(subtotalPhp * 0.12);
  const total = subtotalPhp + shipping + tax;
  return { subtotal: subtotalPhp, shipping, tax, total };
}

export function OrderSummary({
  subtotalPhp,
  children,
}: {
  subtotalPhp: number;
  children?: ReactNode;
}) {
  const currency = useAppSelector(selectDisplayCurrency);
  const { subtotal, shipping, tax, total } = computeTotals(subtotalPhp);
  const fmt = (php: number) => formatMoney(convert(php, 'PHP', currency), currency);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-content">Order summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="text-content">{fmt(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="text-content">{shipping === 0 ? 'Free' : fmt(shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Tax (12% VAT)</dt>
          <dd className="text-content">{fmt(tax)}</dd>
        </div>
        <div className="my-3 border-t border-line" />
        <div className="flex justify-between text-base">
          <dt className="font-semibold text-content">Total</dt>
          <dd className="font-display text-lg font-bold text-brand-400">{fmt(total)}</dd>
        </div>
      </dl>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
