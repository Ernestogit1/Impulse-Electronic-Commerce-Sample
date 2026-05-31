/**
 * Currency display state lives in uiSlice. This module re-exports the relevant pieces so
 * imports like `@/features/ui/currency` resolve to a single, intentional source.
 */
export { selectDisplayCurrency, setDisplayCurrency } from './uiSlice';
