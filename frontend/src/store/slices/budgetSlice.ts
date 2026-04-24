import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const budgetSlice = createSlice({
  name: "budgets",
  initialState: {
    categoryBudgets: [] as object[],
    monthlyBudgets: [] as object[],
  },
  reducers: {
    setMonthlyBudgets: (state, action: PayloadAction<object[]>) => {
      state.monthlyBudgets = action.payload;
    },
    setCategoryBudgets: (state, action: PayloadAction<object[]>) => {
      state.categoryBudgets = action.payload;
    },
  },
});

export const { setMonthlyBudgets, setCategoryBudgets } = budgetSlice.actions;
export default budgetSlice.reducer;
