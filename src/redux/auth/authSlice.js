import { createSlice } from "@reduxjs/toolkit";

import {
  login,
  loginFulfilledReducer,
  loginPendingReducer,
  loginRejectedReducer,
  logoutReducer,
} from "./authReducer";

const initialState = {
  token: null,
  email: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: logoutReducer,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, loginPendingReducer)
      .addCase(login.fulfilled, loginFulfilledReducer)
      .addCase(login.rejected, loginRejectedReducer);
  },
});

export const { logout } = authSlice.actions;
export { login };
export default authSlice.reducer;
