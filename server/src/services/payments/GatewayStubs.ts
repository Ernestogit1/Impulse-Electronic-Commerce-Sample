/**
 * Production payment providers — STUBS that show exactly where real SDK calls plug in.
 * Each documents the env keys it needs. To go live: install the SDK, drop in the
 * credentials, and replace the `notImplemented()` bodies. The rest of the app is unchanged
 * because they all satisfy the same PaymentProvider interface.
 */
import type {
  CreateIntentInput,
  PaymentIntent,
  PaymentProvider,
  PaymentResult,
  RefundResult,
  WebhookEvent,
} from './PaymentProvider';
import type { PaymentProviderName } from '@shared/types';

function notImplemented(provider: string): never {
  throw new Error(
    `${provider} integration is not enabled. Add credentials and implement the SDK calls in GatewayStubs.ts.`,
  );
}

/** Stripe — global cards & wallets. Needs STRIPE_SECRET_KEY (+ STRIPE_WEBHOOK_SECRET). */
export class StripeProvider implements PaymentProvider {
  readonly name = 'stripe' as const;
  // private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' });

  async createIntent(_input: CreateIntentInput): Promise<PaymentIntent> {
    // TODO: return this.stripe.paymentIntents.create({ amount, currency, metadata })
    notImplemented('Stripe');
  }
  async confirm(_intentId: string): Promise<PaymentResult> {
    // TODO: const pi = await this.stripe.paymentIntents.retrieve(intentId)
    notImplemented('Stripe');
  }
  async refund(_intentId: string): Promise<RefundResult> {
    // TODO: return this.stripe.refunds.create({ payment_intent: intentId })
    notImplemented('Stripe');
  }
  async handleWebhook(_payload: unknown, _signature?: string): Promise<WebhookEvent> {
    // TODO: this.stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET)
    notImplemented('Stripe');
  }
}

/** PayMongo — PH gateway (GCash, cards, e-wallets). Needs PAYMONGO_SECRET_KEY. */
export class PayMongoProvider implements PaymentProvider {
  readonly name = 'paymongo' as const;
  async createIntent(_input: CreateIntentInput): Promise<PaymentIntent> {
    // TODO: POST https://api.paymongo.com/v1/payment_intents  (Basic auth with secret key)
    notImplemented('PayMongo');
  }
  async confirm(_intentId: string): Promise<PaymentResult> {
    // TODO: GET https://api.paymongo.com/v1/payment_intents/:id
    notImplemented('PayMongo');
  }
  async refund(_intentId: string): Promise<RefundResult> {
    // TODO: POST https://api.paymongo.com/v1/refunds
    notImplemented('PayMongo');
  }
  async handleWebhook(_payload: unknown, _signature?: string): Promise<WebhookEvent> {
    // TODO: verify Paymongo-Signature header
    notImplemented('PayMongo');
  }
}

/** Xendit — SEA gateway (bank transfer & e-wallets). Needs XENDIT_SECRET_KEY. */
export class XenditProvider implements PaymentProvider {
  readonly name = 'xendit' as const;
  async createIntent(_input: CreateIntentInput): Promise<PaymentIntent> {
    // TODO: xendit.Invoice.createInvoice({ externalID, amount, payerEmail, currency })
    notImplemented('Xendit');
  }
  async confirm(_intentId: string): Promise<PaymentResult> {
    notImplemented('Xendit');
  }
  async refund(_intentId: string): Promise<RefundResult> {
    notImplemented('Xendit');
  }
  async handleWebhook(_payload: unknown, _signature?: string): Promise<WebhookEvent> {
    // TODO: verify x-callback-token header
    notImplemented('Xendit');
  }
}

export type { PaymentProviderName };
