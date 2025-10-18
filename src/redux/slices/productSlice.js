import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Helper: create axios instance with auth header
 */
const api = (token) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * Fetch all products (with pagination and optional search)
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ page = 1, search = "" }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue("Unauthorized: Missing token");

      const response = await api(token).get("/products", {
        params: { page, search },
      });
      return response.data; // expected: { products, totalPages }
    } catch (err) {
      console.error("Fetch error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

/**
 * Fetch single product details
 */
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api(token).get(`/products/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch product");
    }
  }
);

/**
 * Create a new product
 */
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api(token).post("/products", productData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create product"
      );
    }
  }
);

/**
 * Update existing product
 */
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api(token).put(`/products/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

/**
 * Delete product
 */
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await api(token).delete(`/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

/**
 * Initial state
 */
const initialState = {
  items: [],
  currentProduct: null,
  page: 1,
  totalPages: 1,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

/**
 * Slice
 */
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ====== Fetch All ======
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ====== Fetch One ======
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ====== Create ======
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload); // optimistic insert
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ====== Update ======
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ====== Delete ======
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
