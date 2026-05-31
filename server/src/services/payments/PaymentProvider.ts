import type { CurrencyCode, PaymentProviderName, PaymentStatus } from '@shared/types';

/**
 * The payment abstraction. Every provider (mock today; Stripe/PayMongo/Xendit later)
 * implements this single interface, so the order/checkout service depends ONLY on the
 * interface — never a concrete gateway. Swapping providers is a config change.
 */
export interface CreateIntentInput {
  amount: number; // smallest display unit (e.g. PHP whole pesos in this demo)
  currency: CurrencyCode;
  orderRef: string;
  customerEmail: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntent {
  intentId: string;
  status: PaymentStatus;
  provider: PaymentProviderName;
  amount: number;
  currency: CurrencyCode;
  clientSecret?: string;
}

export interface PaymentResult {
  intentId: string;
  transactionId: string;
  status: PaymentStatus;
  provider: PaymentProviderName;
}

export interface RefundResult {
  refundId: string;
  status: PaymentStatus;
}

export interface WebhookEvent {
  type: string;
  intentId?: string;
  status?: PaymentStatus;
}

export interface PaymentProvider {
  readonly name: PaymentProviderName;
  createIntent(input: CreateIntentInput): Promise<PaymentIntent>;
  confirm(intentId: string): Promise<PaymentResult>;
  refund(intentId: string, amount?: number): Promise<RefundResult>;
  handleWebhook(payload: unknown, signature?: string): Promise<WebhookEvent>;
}
