import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk: handle login
export const login = createAsyncThunk(
  "auth/login",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth", { email });
      return { token: response.data.token, email };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Reducer functions (plain JS)
export const logoutReducer = (state) => {
  state.token = null;
  state.email = null;
  state.status = "idle";
  state.error = null;
};

export const loginPendingReducer = (state) => {
  state.status = "loading";
  state.error = null;
};

export const loginFulfilledReducer = (state, action) => {
  state.status = "idle";
  state.token = action.payload.token;
  state.email = action.payload.email;
};

export const loginRejectedReducer = (state, action) => {
  state.status = "error";
  state.error = action.payload;
};
