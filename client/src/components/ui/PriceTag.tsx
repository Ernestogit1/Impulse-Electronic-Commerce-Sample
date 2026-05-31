import { useAppSelector } from '@/app/hooks';
import { formatMoney, convert } from '@/lib/money';
import { cn } from '@/lib/cn';
import type { CurrencyCode } from '@shared/types';
import { selectDisplayCurrency } from '@/features/ui/uiSlice';

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  currency?: CurrencyCode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

export function PriceTag({ price, compareAtPrice, currency = 'PHP', size = 'md', className }: PriceTagProps) {
  const display = useAppSelector(selectDisplayCurrency);
  const shown = convert(price, currency, display);
  const compare = compareAtPrice ? convert(compareAtPrice, currency, display) : undefined;
  const hasDiscount = compare !== undefined && compare > shown;

  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className={cn('font-semibold text-content', sizeMap[size])}>
        {formatMoney(shown, display)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted line-through">{formatMoney(compare!, display)}</span>
      )}
    </span>
  );
}
