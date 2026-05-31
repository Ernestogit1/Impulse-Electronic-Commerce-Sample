import { randomUUID } from 'node:crypto';
import { repositories } from '@/repositories';
import { ApiError } from '@/utils/ApiError';
import { getPaymentProvider } from './payments/PaymentProviderFactory';
import type { CheckoutDTO, Order, OrderItem, OrderStatus } from '@shared/types';

export const orderService = {
  /**
   * Checkout: validate stock → create payment intent → confirm via the payment ABSTRACTION
   * (never a concrete gateway) → persist order → decrement inventory.
   */
  async checkout(dto: CheckoutDTO, user: { id: string; email: string }): Promise<Order> {
    const items: OrderItem[] = [];
    for (const line of dto.items) {
      const product = await repositories.products.findById(line.productId);
      if (!product) throw ApiError.badRequest(`Unknown product ${line.productId}`);
      if (product.stock < line.quantity) throw ApiError.conflict(`${product.title} is out of stock`);
      items.push({
        productId: product.id,
        title: product.title,
        image: product.images[0]?.url,
        sku: line.variantSku,
        unitPrice: product.price,
        quantity: line.quantity,
      });
    }

    const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const shipping = subtotal > 10000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + shipping + tax;
    const orderRef = `IMP-${Date.now().toString().slice(-6)}`;

    // ── payment via the abstraction ──
    const provider = getPaymentProvider(dto.paymentProvider);
    const intent = await provider.createIntent({
      amount: total,
      currency: dto.currency,
      orderRef,
      customerEmail: dto.contactEmail,
    });
    const result = await provider.confirm(intent.intentId);
    if (result.status !== 'paid') throw ApiError.badRequest('Payment was declined. Please try another method.');

    const now = new Date().toISOString();
    const order: Order = {
      id: `order-${randomUUID().slice(0, 8)}`,
      orderNumber: orderRef,
      userId: user.id,
      items,
      subtotal,
      shipping,
      tax,
      discount: 0,
      total,
      currency: dto.currency,
      shippingAddress: dto.shippingAddress,
      contactEmail: dto.contactEmail,
      payment: {
        provider: result.provider,
        intentId: result.intentId,
        transactionId: result.transactionId,
        status: 'paid',
        amount: total,
        currency: dto.currency,
      },
      status: 'paid',
      placedAt: now,
      updatedAt: now,
    };

    const created = await repositories.orders.create(order);
    await Promise.all(items.map((it) => repositories.products.decrementStock(it.productId, it.quantity)));
    return created;
  },

  listMine(userId: string) {
    return repositories.orders.listByUser(userId);
  },
  async getById(id: string, user: { id: string; role: string }) {
    const order = await repositories.orders.findById(id);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.userId !== user.id && user.role !== 'admin') throw ApiError.forbidden();
    return order;
  },
  listAll() {
    return repositories.orders.listAll();
  },
  async updateStatus(id: string, status: OrderStatus) {
    const updated = await repositories.orders.updateStatus(id, status);
    if (!updated) throw ApiError.notFound('Order not found');
    return updated;
  },
};
