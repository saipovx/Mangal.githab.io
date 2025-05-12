import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedType: 'All',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
  },
});

export const { setProducts, setSelectedType } = productsSlice.actions;
export const selectProducts = (state) => state.products.products;
export const selectSelectedType = (state) => state.products.selectedType;
export default productsSlice.reducer;
