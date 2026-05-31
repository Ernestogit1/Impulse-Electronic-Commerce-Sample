import type { Request, Response } from 'express';
import { asyncHandler, ok } from '@/utils/http';
import { getPaymentProvider } from '@/services/payments/PaymentProviderFactory';

export const paymentController = {
  /**
   * Webhook receiver (mock now). In production each provider verifies its own signature
   * header; idempotency is enforced by storing processed event IDs before acting.
   */
  webhook: asyncHandler(async (req: Request, res: Response) => {
    const provider = getPaymentProvider();
    const event = await provider.handleWebhook(req.body, req.headers['x-signature'] as string | undefined);
    // TODO(production): look up the order by event.intentId and update its payment status idempotently.
    ok(res, { received: true, event });
  }),
};
