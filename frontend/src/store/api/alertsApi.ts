import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const alertsApi = createApi({
  reducerPath: "alertsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1`,
    credentials: "include",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Alert"],
  endpoints: (builder) => ({
    getAlerts: builder.query({
      query: (params) => ({
        url: "/alerts",
        params,
      }),
      providesTags: ["Alert"],
    }),
    markAlertRead: builder.mutation({
      query: (id) => ({
        url: `/alerts/read/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Alert"],
    }),
    markAllRead: builder.mutation({
      query: () => ({
        url: "alerts/read",
        method: "POST",
      }),
      invalidatesTags: ["Alert"],
    }),
    dismissAlert: builder.mutation({
      query: (id) => ({
        url: `alerts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Alert"],
    }),
  }),
});

export const {
  useGetAlertsQuery,
  useMarkAlertReadMutation,
  useMarkAllReadMutation,
  useDismissAlertMutation,
} = alertsApi;
