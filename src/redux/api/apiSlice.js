import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/utils/axiosBaseQuery";

export const apiSlices = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  tagTypes: ["Products", "Auth"],
  endpoints: (builder) => ({
    // Login endpoint (no auth needed)
    login: builder.mutation({
      query: (email) => {
        console.log("log in email", email);
        return {
          url: "/auth",
          method: "POST",
          data: { email },
        };
      },
      invalidatesTags: ["Auth"],
    }),

    // Get products (auth required - token added automatically)
    getProducts: builder.query({
      query: () => {
        console.log(fff);
        return {
          url: "/products",
          method: "GET",
        };
      },
      providesTags: ["Products"],
    }),

    // Create product (auth required)
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        data: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update product (auth required)
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        data: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Delete product (auth required)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = apiSlices;
