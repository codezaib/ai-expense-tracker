import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { budgetApi } from "./budgetApi";
import { alertsApi } from "./alertsApi";
const invalidateAll = async (dispatch: any, queryFulfilled: any) => {
  await queryFulfilled;
  dispatch(budgetApi.util.invalidateTags(["Budget"]));
};
const invalidateAllAlerts = async (dispatch: any, queryFulfilled: any) => {
  await queryFulfilled;
  dispatch(alertsApi.util.invalidateTags(["Alert"]));
};
export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1`,
    credentials: "include",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Expense"],
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: (params) => ({
        url: "/expenses",
        params,
      }),
      providesTags: ["Expense"],
    }),
    addExpense: builder.mutation({
      query: (expense) => ({
        url: "/expenses",
        method: "POST",
        body: expense,
      }),
      invalidatesTags: ["Expense"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await invalidateAll(dispatch, queryFulfilled);
        await invalidateAllAlerts(dispatch, queryFulfilled);
      },
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/expenses/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Expense"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await invalidateAll(dispatch, queryFulfilled);
        await invalidateAllAlerts(dispatch, queryFulfilled);
      },
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await invalidateAll(dispatch, queryFulfilled);
        await invalidateAllAlerts(dispatch, queryFulfilled);
      },
    }),
    getSpendingTrend: builder.query({
      query: ({ days }) => `/expenses/trend?days=${days}`,
      providesTags: ["Expense"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await invalidateAll(dispatch, queryFulfilled);
      },
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetSpendingTrendQuery,
} = expenseApi;
