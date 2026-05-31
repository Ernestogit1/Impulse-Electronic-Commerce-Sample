import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadState, saveState } from '@/lib/storage';
import type { RootState } from '@/app/store';

const KEY = 'impulse.wishlist';

interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = { productIds: loadState<string[]>(KEY, []) };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.productIds.indexOf(id);
      if (idx >= 0) state.productIds.splice(idx, 1);
      else state.productIds.push(id);
      saveState(KEY, state.productIds);
    },
    clearWishlist(state) {
      state.productIds = [];
      saveState(KEY, state.productIds);
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectWishlistIds = (s: RootState) => s.wishlist.productIds;
export const selectWishlistCount = (s: RootState) => s.wishlist.productIds.length;
export const selectIsWishlisted = (id: string) => (s: RootState) =>
  s.wishlist.productIds.includes(id);
