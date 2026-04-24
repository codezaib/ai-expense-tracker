import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import aiReducer from "./slices/aiSlice";
import alertsReducer from "./slices/alertsSlice";
import authReducer from "./slices/authSlice";
import budgetReducer from "./slices/budgetSlice";
import expenseReducer from "./slices/expenseSlice";
import { authApi } from "./api/authApi";
import { aiApi } from "./api/aiApi";
import { alertsApi } from "./api/alertsApi";
import { budgetApi } from "./api/budgetApi";
import { categoryApi } from "./api/categoryApi";
import { expenseApi } from "./api/expenseApi";

const store = configureStore({
  reducer: {
    [aiApi.reducerPath]: aiApi.reducer,
    [alertsApi.reducerPath]: alertsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [budgetApi.reducerPath]: budgetApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    budgets: budgetReducer,
    auth: authReducer,
    alerts: alertsReducer,
    ai: aiReducer,
    expense: expenseReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      authApi.middleware,
      aiApi.middleware,
      alertsApi.middleware,
      budgetApi.middleware,
      categoryApi.middleware,
      expenseApi.middleware,
    );
  },
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
