import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@shared/types';
import { loadState, saveState } from '@/lib/storage';
import type { RootState } from '@/app/store';

const KEY = 'impulse.cart';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: loadState<CartItem[]>(KEY, []) };

const sameLine = (a: CartItem, b: { productId: string; variantSku?: string }) =>
  a.productId === b.productId && (a.variantSku ?? '') === (b.variantSku ?? '');

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const incoming = action.payload;
      const existing = state.items.find((i) => sameLine(i, incoming));
      if (existing) {
        existing.quantity = Math.min(existing.quantity + incoming.quantity, existing.stock || 99);
      } else {
        state.items.push({ ...incoming, quantity: Math.max(1, incoming.quantity) });
      }
      saveState(KEY, state.items);
    },
    setQuantity(
      state,
      action: PayloadAction<{ productId: string; variantSku?: string; quantity: number }>,
    ) {
      const item = state.items.find((i) => sameLine(i, action.payload));
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock || 99));
        saveState(KEY, state.items);
      }
    },
    removeFromCart(
      state,
      action: PayloadAction<{ productId: string; variantSku?: string }>,
    ) {
      state.items = state.items.filter((i) => !sameLine(i, action.payload));
      saveState(KEY, state.items);
    },
    clearCart(state) {
      state.items = [];
      saveState(KEY, state.items);
    },
    /** Merge a (server/guest) cart into the current one — used on login. */
    mergeCart(state, action: PayloadAction<CartItem[]>) {
      for (const incoming of action.payload) {
        const existing = state.items.find((i) => sameLine(i, incoming));
        if (existing) existing.quantity = Math.max(existing.quantity, incoming.quantity);
        else state.items.push(incoming);
      }
      saveState(KEY, state.items);
    },
  },
});

export const { addToCart, setQuantity, removeFromCart, clearCart, mergeCart } = cartSlice.actions;
export default cartSlice.reducer;

/* selectors */
export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) =>
  s.cart.items.reduce((n, i) => n + i.quantity, 0);
export const selectCartSubtotal = (s: RootState) =>
  s.cart.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
