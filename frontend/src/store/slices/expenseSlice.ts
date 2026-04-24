import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { set } from "date-fns";
interface ExpenseState {
  expenses: object[];
  filters: Record<string, any>;
  pagination: Record<string, any>;
}

const initialState: ExpenseState = {
  expenses: [] as object[],
  filters: {
    category_id: null,
    start: new Date(Date.now() - 7 * 864e5).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
    sort_by: "date",
    order: "desc",
    search: "",
  },
  pagination: {
    page: 1,
    limit: 10,
  },
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<object>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
    setExpenses: (state, action: PayloadAction<object[]>) => {
      state.expenses = action.payload;
    },
  },
});

export const { setFilters, resetFilters, setPage, setLimit, setExpenses } =
  expenseSlice.actions;
export default expenseSlice.reducer;
