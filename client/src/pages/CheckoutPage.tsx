import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress';
import { LockRounded } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { OrderSummary } from '@/features/checkout/OrderSummary';
import { PaymentMethodSelect } from '@/features/checkout/PaymentMethodSelect';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCartItems, selectCartSubtotal, clearCart } from '@/features/cart/cartSlice';
import { selectDisplayCurrency, pushToast } from '@/features/ui/uiSlice';
import { useAuth } from '@/features/auth/useAuth';
import { useCheckoutMutation } from '@/services/api/apiSlice';
import type { Address, PaymentProviderName } from '@shared/types';

const STEPS = ['Shipping', 'Payment', 'Review'];

const emptyAddress: Address = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  region: 'Metro Manila',
  postalCode: '',
  country: 'Philippines',
  phone: '',
};

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const currency = useAppSelector(selectDisplayCurrency);
  const { user, loginAsDemo } = useAuth();
  const [checkout, { isLoading }] = useCheckoutMutation();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState(user?.email ?? '');
  const [address, setAddress] = useState<Address>({ ...emptyAddress, fullName: user?.name ?? '' });
  const [provider, setProvider] = useState<PaymentProviderName>('mock');

  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <Button component={Link} to="/catalog" variant="contained" sx={{ mt: 3 }}>
          Continue shopping
        </Button>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-content">Sign in to checkout</h1>
          <p className="mt-2 text-muted">Use a demo account to complete the order flow instantly.</p>
          <div className="mt-6 space-y-2">
            <Button fullWidth variant="contained" onClick={() => loginAsDemo('customer')}>
              Continue as demo customer
            </Button>
            <Button fullWidth variant="outlined" component={Link} to="/login">
              Go to sign in
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const canContinueShipping =
    email.trim() && address.fullName.trim() && address.line1.trim() && address.city.trim() && address.postalCode.trim();

  const field = (label: string, key: keyof Address, required = false) => (
    <TextField
      label={label}
      required={required}
      fullWidth
      value={address[key] ?? ''}
      onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
    />
  );

  const placeOrder = async () => {
    try {
      const order = await checkout({
        dto: {
          items: items.map((i) => ({ productId: i.productId, variantSku: i.variantSku, quantity: i.quantity })),
          shippingAddress: address,
          contactEmail: email,
          currency,
          paymentProvider: provider,
        },
        user,
      }).unwrap();
      dispatch(clearCart());
      dispatch(pushToast('Payment successful — order placed!', 'success'));
      navigate(`/order/${order.id}`);
    } catch {
      dispatch(pushToast('Payment failed. Please try again.', 'error'));
    }
  };

  return (
    <Container className="py-10">
      <h1 className="mb-6 font-display text-3xl font-bold text-content">Checkout</h1>
      <Stepper activeStep={step} sx={{ mb: 6, maxWidth: 520 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-line bg-surface p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold">Contact & shipping</h2>
              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {field('Full name', 'fullName', true)}
              {field('Address line 1', 'line1', true)}
              {field('Address line 2', 'line2')}
              <div className="grid gap-4 sm:grid-cols-2">
                {field('City', 'city', true)}
                {field('Region / Province', 'region')}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {field('Postal code', 'postalCode', true)}
                {field('Country', 'country')}
              </div>
              {field('Phone', 'phone')}
              <Button
                variant="contained"
                size="large"
                disabled={!canContinueShipping}
                onClick={() => setStep(1)}
              >
                Continue to payment
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-semibold">Payment method</h2>
              <PaymentMethodSelect value={provider} onChange={setProvider} />
              <div className="flex gap-3">
                <Button variant="text" onClick={() => setStep(0)}>Back</Button>
                <Button variant="contained" size="large" onClick={() => setStep(2)}>
                  Review order
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-semibold">Review & place order</h2>
              <div className="rounded-xl border border-line p-4 text-sm">
                <div className="mb-1 font-semibold text-content">Shipping to</div>
                <p className="text-muted">
                  {address.fullName}, {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city},{' '}
                  {address.region} {address.postalCode}, {address.country}
                </p>
                <p className="text-muted">{email}</p>
              </div>
              <div className="rounded-xl border border-line p-4 text-sm">
                <div className="mb-2 font-semibold text-content">Items</div>
                <ul className="space-y-1">
                  {items.map((i) => (
                    <li key={i.productId} className="flex justify-between text-muted">
                      <span>{i.title} × {i.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-muted">
                Payment is simulated through the mock provider — no real charge is made.
              </p>
              <div className="flex gap-3">
                <Button variant="text" onClick={() => setStep(1)} disabled={isLoading}>Back</Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <LockRounded />}
                  disabled={isLoading}
                  onClick={placeOrder}
                >
                  {isLoading ? 'Processing…' : 'Pay & place order'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary subtotalPhp={subtotal} />
        </div>
      </div>
    </Container>
  );
}
