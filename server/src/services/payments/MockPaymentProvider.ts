import { randomUUID } from 'node:crypto';
import type {
  CreateIntentInput,
  PaymentIntent,
  PaymentProvider,
  PaymentResult,
  RefundResult,
  WebhookEvent,
} from './PaymentProvider';

/**
 * Simulated gateway used for the demo. Mimics latency and a high success rate,
 * generates fake intent/transaction IDs, and never contacts a real provider.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock' as const;

  private delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
  }

  async createIntent(input: CreateIntentInput): Promise<PaymentIntent> {
    await this.delay(250);
    const intentId = `pi_mock_${randomUUID().slice(0, 12)}`;
    return {
      intentId,
      status: 'requires_action',
      provider: this.name,
      amount: input.amount,
      currency: input.currency,
      clientSecret: `${intentId}_secret_${randomUUID().slice(0, 8)}`,
    };
  }

  async confirm(intentId: string): Promise<PaymentResult> {
    await this.delay(400);
    // 97% success — occasionally simulate a decline to exercise the failure path
    const success = Math.random() > 0.03;
    return {
      intentId,
      transactionId: `txn_${randomUUID().slice(0, 12)}`,
      status: success ? 'paid' : 'failed',
      provider: this.name,
    };
  }

  async refund(intentId: string): Promise<RefundResult> {
    await this.delay(300);
    return { refundId: `re_mock_${randomUUID().slice(0, 12)}`, status: 'refunded' };
  }

  async handleWebhook(payload: unknown): Promise<WebhookEvent> {
    const body = (payload ?? {}) as { type?: string; intentId?: string };
    return { type: body.type ?? 'payment.succeeded', intentId: body.intentId, status: 'paid' };
  }
}
