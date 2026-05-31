import type { PaymentProvider } from './PaymentProvider';
import { MockPaymentProvider } from './MockPaymentProvider';
import { StripeProvider, PayMongoProvider, XenditProvider } from './GatewayStubs';
import { env } from '@/config/env';
import type { PaymentProviderName } from '@shared/types';

/** Selects the active payment provider from config. The rest of the app uses only this. */
export function getPaymentProvider(name: PaymentProviderName = env.paymentProvider): PaymentProvider {
  switch (name) {
    case 'stripe':
      return new StripeProvider();
    case 'paymongo':
      return new PayMongoProvider();
    case 'xendit':
      return new XenditProvider();
    case 'mock':
    default:
      return new MockPaymentProvider();
  }
}
