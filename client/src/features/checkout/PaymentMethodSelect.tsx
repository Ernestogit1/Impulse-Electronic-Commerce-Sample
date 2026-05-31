import { CheckCircleRounded, BoltRounded } from '@mui/icons-material';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { PaymentProviderName } from '@shared/types';

interface Method {
  id: PaymentProviderName;
  name: string;
  desc: string;
  enabled: boolean;
}

/**
 * Surfaces the payment-provider abstraction in the UI. Only "mock" is active in this demo;
 * Stripe / PayMongo / Xendit are wired as production integration points (server/services/payments).
 */
const METHODS: Method[] = [
  { id: 'mock', name: 'Mock payment (demo)', desc: 'Simulated gateway — no real charge', enabled: true },
  { id: 'stripe', name: 'Stripe', desc: 'Cards & wallets — production-ready integration point', enabled: false },
  { id: 'paymongo', name: 'PayMongo', desc: 'GCash, cards, e-wallets (PH)', enabled: false },
  { id: 'xendit', name: 'Xendit', desc: 'Bank transfer & e-wallets (SEA)', enabled: false },
];

export function PaymentMethodSelect({
  value,
  onChange,
}: {
  value: PaymentProviderName;
  onChange: (p: PaymentProviderName) => void;
}) {
  return (
    <div className="space-y-3">
      {METHODS.map((m) => {
        const active = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            disabled={!m.enabled}
            onClick={() => m.enabled && onChange(m.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition',
              active ? 'border-brand-500 bg-brand-500/10' : 'border-line hover:border-muted',
              !m.enabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <span
              className={cn(
                'grid h-10 w-10 place-items-center rounded-lg',
                active ? 'bg-brand-500 text-ink-950' : 'bg-elevated text-brand-400',
              )}
            >
              <BoltRounded fontSize="small" />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-2">
                <span className="font-semibold text-content">{m.name}</span>
                {!m.enabled && <Badge tone="neutral">Coming soon</Badge>}
              </span>
              <span className="block text-xs text-muted">{m.desc}</span>
            </span>
            {active && <CheckCircleRounded className="text-brand-400" />}
          </button>
        );
      })}
    </div>
  );
}
