import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { CloseRounded, DeleteOutline, ShoppingBagOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setCartDrawer, selectCartDrawerOpen, selectDisplayCurrency } from '@/features/ui/uiSlice';
import {
  removeFromCart,
  setQuantity,
  selectCartItems,
  selectCartSubtotal,
} from '@/features/cart/cartSlice';
import { ProductImage } from '@/components/ui/ProductImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatMoney, convert } from '@/lib/money';

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const open = useAppSelector(selectCartDrawerOpen);
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const currency = useAppSelector(selectDisplayCurrency);
  const close = () => dispatch(setCartDrawer(false));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, bgcolor: 'background.default' } }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Your cart</h2>
          <IconButton onClick={close} aria-label="Close cart">
            <CloseRounded />
          </IconButton>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              icon={<ShoppingBagOutlined />}
              title="Your cart is empty"
              description="Discover something you’ll love."
              action={
                <Button variant="contained" onClick={() => { close(); navigate('/catalog'); }}>
                  Browse products
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantSku ?? ''}`} className="flex gap-3">
                  <ProductImage
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium text-content">{item.title}</p>
                      <IconButton
                        size="small"
                        aria-label="Remove"
                        onClick={() => dispatch(removeFromCart({ productId: item.productId, variantSku: item.variantSku }))}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </div>
                    <span className="text-sm font-semibold text-brand-400">
                      {formatMoney(convert(item.unitPrice, item.currency, currency), currency)}
                    </span>
                    <div className="mt-2">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        max={item.stock || 99}
                        onChange={(q) =>
                          dispatch(setQuantity({ productId: item.productId, variantSku: item.variantSku, quantity: q }))
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-lg font-semibold">
                  {formatMoney(convert(subtotal, 'PHP', currency), currency)}
                </span>
              </div>
              <p className="mb-3 text-xs text-muted">Shipping & taxes calculated at checkout.</p>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={() => { close(); navigate('/checkout'); }}
              >
                Checkout
              </Button>
              <Button fullWidth sx={{ mt: 1 }} onClick={() => { close(); navigate('/cart'); }}>
                View full cart
              </Button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
