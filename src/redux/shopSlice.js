import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shops: [],
  selectedBranch: JSON.parse(localStorage.getItem("selectedBranch")) || null,
  warning: null,
};

const shopSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    setShops: (state, action) => {
      state.shops = action.payload;
      // Filiallar yangilanganda statusni tekshirish
      if (state.selectedBranch) {
        const currentBranch = action.payload.find(
          (shop) => shop.id === state.selectedBranch.id
        );

        if (
          !currentBranch ||
          !currentBranch.is_active ||
          currentBranch.work_status === "yopiq"
        ) {
          // Yangi ochiq filial topish
          const newBranch = action.payload.find(
            (shop) => shop.is_active && shop.work_status === "ochiq"
          );

          state.selectedBranch = newBranch || null;
          localStorage.setItem("selectedBranch", JSON.stringify(newBranch));
          state.warning = "Filial mavjud emas";
        }
      }
    },
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
      localStorage.setItem("selectedBranch", JSON.stringify(action.payload));
      state.warning = null;
    },
    clearWarning: (state) => {
      state.warning = null;
    },
  },
});

export const { setShops, setSelectedBranch, clearWarning } = shopSlice.actions;
export default shopSlice.reducer;
