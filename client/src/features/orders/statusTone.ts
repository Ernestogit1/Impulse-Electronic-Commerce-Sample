import type { OrderStatus } from '@shared/types';

type Tone = 'brand' | 'neutral' | 'success' | 'danger' | 'warning' | 'info';

export const orderStatusTone: Record<OrderStatus, Tone> = {
  pending: 'warning',
  paid: 'info',
  fulfilled: 'brand',
  completed: 'success',
  cancelled: 'danger',
  refunded: 'neutral',
};

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  fulfilled: 'Fulfilled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};
