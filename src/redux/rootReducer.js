import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import authReducer from "./slices/authSlice";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});
