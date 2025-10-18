import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  products: productReducer
});
