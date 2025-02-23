import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/shop-categories/from-shop?shop_id=${shopId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    updateCategories: (state, action) => {
      state.categories = action.payload;
      state.lastUpdated = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        if (
          JSON.stringify(state.categories) !== JSON.stringify(action.payload)
        ) {
          state.categories = action.payload;
          state.lastUpdated = Date.now();
          localStorage.setItem("categories", JSON.stringify(action.payload));
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
