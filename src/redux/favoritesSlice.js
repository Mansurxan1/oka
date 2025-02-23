import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedProducts: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload; // To‘liq mahsulot obyektini qabul qilamiz
      const existingIndex = state.likedProducts.findIndex(
        (p) => p.id === product.id
      );

      if (existingIndex !== -1) {
        // Agar oldin saqlangan bo‘lsa, uni o‘chirib tashlaymiz
        state.likedProducts.splice(existingIndex, 1);
      } else {
        // Aks holda mahsulotni saqlaymiz
        state.likedProducts.push(product);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
