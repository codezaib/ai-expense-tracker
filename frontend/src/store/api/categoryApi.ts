import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { budgetApi } from "./budgetApi";
const invalidateAll = async (dispatch: any, queryFulfilled: any) => {
  await queryFulfilled;
  dispatch(budgetApi.util.invalidateTags(["Budget"]));
};
export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1`,
    credentials: "include",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (category) => ({
        url: "/categories",
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["Category"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await invalidateAll(dispatch, queryFulfilled);
      },
    }),
    editCategory: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: category,
      }),
      invalidatesTags: ["Category"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await invalidateAll(dispatch, queryFulfilled);
      },
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await invalidateAll(dispatch, queryFulfilled);
      },
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
