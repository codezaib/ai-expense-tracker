import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1`,
    credentials: "include",
    prepareHeaders: (headers) => headers,
  }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: "/ai/models/chat",
        method: "POST",
        body: messageData,
      }),
    }),
    getModels: builder.query({
      query: () => "/ai/models",
    }),
  }),
});

export const { useSendMessageMutation, useGetModelsQuery } = aiApi;
