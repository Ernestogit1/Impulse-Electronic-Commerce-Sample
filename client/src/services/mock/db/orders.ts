import type { Order, OrderItem, OrderStatus } from '@shared/types';
import { mockProducts } from './products';
import { mockDirectory } from './users';

const lineFrom = (productId: string, quantity: number): OrderItem => {
  const p = mockProducts.find((x) => x.id === productId) ?? mockProducts[0];
  return {
    productId: p.id,
    title: p.title,
    image: p.images[0]?.url,
    unitPrice: p.price,
    quantity,
  };
};

interface OrderSeed {
  userIdx: number;
  items: Array<[string, number]>;
  status: OrderStatus;
  daysAgo: number;
}

const SEEDS: OrderSeed[] = [
  { userIdx: 0, items: [['prod-001', 1], ['prod-019', 1]], status: 'completed', daysAgo: 2 },
  { userIdx: 2, items: [['prod-008', 1]], status: 'fulfilled', daysAgo: 4 },
  { userIdx: 3, items: [['prod-005', 1], ['prod-022', 2]], status: 'paid', daysAgo: 6 },
  { userIdx: 4, items: [['prod-016', 1]], status: 'pending', daysAgo: 1 },
  { userIdx: 5, items: [['prod-002', 1], ['prod-011', 1]], status: 'completed', daysAgo: 12 },
  { userIdx: 6, items: [['prod-013', 1]], status: 'cancelled', daysAgo: 18 },
  { userIdx: 0, items: [['prod-009', 1], ['prod-022', 3]], status: 'completed', daysAgo: 25 },
  { userIdx: 2, items: [['prod-019', 2]], status: 'refunded', daysAgo: 30 },
];

const SHIPPING = 150;

export const mockOrders: Order[] = SEEDS.map((s, i) => {
  const user = mockDirectory[s.userIdx] ?? mockDirectory[0];
  const items = s.items.map(([id, qty]) => lineFrom(id, qty));
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + SHIPPING + tax;
  const placed = new Date(Date.now() - s.daysAgo * 86_400_000).toISOString();
  return {
    id: `order-${String(i + 1).padStart(3, '0')}`,
    orderNumber: `IMP-${10240 + i}`,
    userId: user.id,
    items,
    subtotal,
    shipping: SHIPPING,
    tax,
    discount: 0,
    total,
    currency: 'PHP',
    shippingAddress: {
      fullName: user.name,
      line1: '123 Demo Street',
      city: 'Makati',
      region: 'Metro Manila',
      postalCode: '1226',
      country: 'Philippines',
    },
    contactEmail: user.email,
    payment: {
      provider: 'mock',
      intentId: `pi_mock_${1000 + i}`,
      transactionId: `txn_${5000 + i}`,
      status: s.status === 'refunded' ? 'refunded' : 'paid',
      amount: total,
      currency: 'PHP',
    },
    status: s.status,
    placedAt: placed,
    updatedAt: placed,
  };
});
