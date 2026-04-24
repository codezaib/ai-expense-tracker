import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1`,
    credentials: "include",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Budget"],
  endpoints: (builder) => ({
    getBudgets: builder.query({
      query: (months: number = 6) => `/budgets/monthly?months=${months}`,
      providesTags: ["Budget"],
    }),
    updateBudget: builder.mutation({
      query: (budget) => ({
        url: "/budgets/monthly",
        method: "POST",
        body: budget,
      }),
      invalidatesTags: ["Budget"],
      async onQueryStarted(updatedBudget, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          budgetApi.util.updateQueryData("getBudgets", undefined, (draft) => {
            const index = draft.findIndex(
              (b: { id: number }) => b.id === data.id,
            );
            if (index !== -1) {
              draft[index] = data;
            }
          }),
        );
      },
    }),
    getCategoryBudgets: builder.query({
      query: () => "/budgets/categories",
      providesTags: ["Budget"],
    }),
  }),
});

export const {
  useGetBudgetsQuery,
  useUpdateBudgetMutation,
  useGetCategoryBudgetsQuery,
} = budgetApi;
