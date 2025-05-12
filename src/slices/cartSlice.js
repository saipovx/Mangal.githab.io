// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('basket')) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item =>
        item.id === action.payload.id &&
        (item.variant ? item.variant === action.payload.variant : true)
      );
      if (!existing) {
        state.items.push(action.payload);
        localStorage.setItem('basket', JSON.stringify(state.items));
      }
    },
    setCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('basket', JSON.stringify(action.payload));
    }
  },
});

export const { addToCart, setCart } = cartSlice.actions;
export const selectCart = (state) => state.cart.items;
export default cartSlice.reducer;
