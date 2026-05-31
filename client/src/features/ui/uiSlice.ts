import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { CurrencyCode } from '@shared/types';
import { loadState, saveState } from '@/lib/storage';
import { env } from '@/lib/env';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface UiState {
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  toasts: Toast[];
  displayCurrency: CurrencyCode;
}

const CURRENCY_KEY = 'impulse.currency';

const initialState: UiState = {
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  toasts: [],
  displayCurrency: loadState<CurrencyCode>(CURRENCY_KEY, env.defaultCurrency),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCartDrawer(state, action: PayloadAction<boolean>) {
      state.cartDrawerOpen = action.payload;
    },
    setMobileMenu(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },
    pushToast: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload);
      },
      prepare(message: string, variant: ToastVariant = 'success') {
        return { payload: { id: nanoid(), message, variant } };
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setDisplayCurrency(state, action: PayloadAction<CurrencyCode>) {
      state.displayCurrency = action.payload;
      saveState(CURRENCY_KEY, action.payload);
    },
  },
});

export const {
  setCartDrawer,
  setMobileMenu,
  setSearchOpen,
  pushToast,
  dismissToast,
  setDisplayCurrency,
} = uiSlice.actions;
export default uiSlice.reducer;

export const selectToasts = (s: RootState) => s.ui.toasts;
export const selectCartDrawerOpen = (s: RootState) => s.ui.cartDrawerOpen;
export const selectDisplayCurrency = (s: RootState) => s.ui.displayCurrency;
