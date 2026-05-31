/**
 * Currency formatting — PHP primary (₱), USD secondary.
 * A single place to format prices so the whole app is consistent and i18n-ready.
 */
import type { CurrencyCode } from '@shared/types';

const LOCALES: Record<CurrencyCode, string> = {
  PHP: 'en-PH',
  USD: 'en-US',
};

/** Indicative FX rates for the secondary-currency display toggle (demo only). */
export const FX_TO_PHP: Record<CurrencyCode, number> = {
  PHP: 1,
  USD: 58, // 1 USD ≈ ₱58 (illustrative)
};

export function formatMoney(
  amount: number,
  currency: CurrencyCode = 'PHP',
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(LOCALES[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

/** Convert an amount expressed in `from` currency into `to` currency (demo FX). */
export function convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const inPhp = amount * FX_TO_PHP[from];
  return inPhp / FX_TO_PHP[to];
}

export const currencySymbol = (currency: CurrencyCode): string =>
  currency === 'PHP' ? '₱' : '$';
