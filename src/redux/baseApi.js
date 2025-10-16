import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../utils/axiosBaseQuery"; // your custom axios baseQuery
import { getBaseUrl } from "@/utils/baseUrl";

// Base API setup
export const baseApi = createApi({
  reducerPath: "api", // the key in Redux state
  baseQuery: axiosBaseQuery({ baseUrl: getBaseUrl() }),
  endpoints: () => ({}), // can inject endpoints later with productApi.injectEndpoints
  tagTypes: ["Product", "User"], // tags for cache invalidation
});
