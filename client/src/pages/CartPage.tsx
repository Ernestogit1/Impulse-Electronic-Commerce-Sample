import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { DeleteOutline, ShoppingBagOutlined, ArrowForwardRounded } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { ProductImage } from '@/components/ui/ProductImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { EmptyState } from '@/components/ui/EmptyState';
import { OrderSummary } from '@/features/checkout/OrderSummary';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectDisplayCurrency } from '@/features/ui/uiSlice';
import {
  removeFromCart,
  setQuantity,
  selectCartItems,
  selectCartSubtotal,
} from '@/features/cart/cartSlice';
import { formatMoney, convert } from '@/lib/money';

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const currency = useAppSelector(selectDisplayCurrency);

  if (items.length === 0) {
    return (
      <Container className="py-20">
        <EmptyState
          icon={<ShoppingBagOutlined />}
          title="Your cart is empty"
          description="Browse the collection and add something you love."
          action={
            <Button variant="contained" component={Link} to="/catalog">
              Shop now
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-content">Shopping cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantSku ?? ''}`} className="flex gap-4 p-4 sm:p-5">
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <ProductImage src={item.image} alt={item.title} className="h-24 w-24 rounded-xl object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <Link to={`/product/${item.slug}`} className="font-medium text-content hover:text-brand-400">
                    {item.title}
                  </Link>
                  <IconButton
                    size="small"
                    aria-label="Remove"
                    onClick={() => dispatch(removeFromCart({ productId: item.productId, variantSku: item.variantSku }))}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </div>
                <span className="text-sm text-muted">
                  {formatMoney(convert(item.unitPrice, item.currency, currency), currency)} each
                </span>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantityStepper
                    value={item.quantity}
                    max={item.stock || 99}
                    onChange={(q) =>
                      dispatch(setQuantity({ productId: item.productId, variantSku: item.variantSku, quantity: q }))
                    }
                  />
                  <span className="font-semibold text-content">
                    {formatMoney(convert(item.unitPrice * item.quantity, item.currency, currency), currency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary subtotalPhp={subtotal}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              onClick={() => navigate('/checkout')}
            >
              Proceed to checkout
            </Button>
            <Button fullWidth component={Link} to="/catalog" sx={{ mt: 1 }}>
              Continue shopping
            </Button>
          </OrderSummary>
        </div>
      </div>
    </Container>
  );
}
