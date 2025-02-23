import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import shopReducer from "./shopSlice";
import categoriesReducer from "./categoriesSlice";
import productsReducer from "./productSlice";
// import cartReducer from "./cartSlice";
import favoritesReducer from "./favoritesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    shops: shopReducer,
    categories: categoriesReducer,
    products: productsReducer,
    // cart: cartReducer,
    favorites: favoritesReducer,
  },
});
