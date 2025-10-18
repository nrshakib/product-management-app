import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Helper: create axios instance with auth header
 */
const api = (token) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

/**
 * Fetch all products (with pagination and optional search)
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (
    { page = 1, search = "", limit = 10 } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue("Unauthorized: Missing token");

      const offset = (page - 1) * limit;

      const response = await api(token).get("/products", {
        params: { offset, limit, search },
      });

      console.log("Fetch products response:", response.data);
      return response.data; // expected: { products, totalPages } or array
    } catch (err) {
      console.error("Fetch products error:", err);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch products"
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
      if (!token) return rejectWithValue("Unauthorized: Missing token");

      const response = await api(token).get(`/products/${id}`);
      console.log("Fetch product by ID response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Fetch product by ID error:", err);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch product"
      );
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
      if (!token) return rejectWithValue("Unauthorized: Missing token");

      const response = await api(token).post("/products", productData);
      console.log("Create product response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Create product error:", err);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create product"
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
      if (!token) return rejectWithValue("Unauthorized: Missing token");

      const response = await api(token).put(`/products/${id}`, data);
      console.log("Update product response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Update product error:", err);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update product"
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
      if (!token) return rejectWithValue("Unauthorized: Missing token");

      await api(token).delete(`/products/${id}`);
      console.log("Delete product success:", id);
      return id;
    } catch (err) {
      console.error("Delete product error:", err);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete product"
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
      state.error = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
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
        state.error = null;

        const payload = action.payload;

        if (Array.isArray(payload)) {
          state.items = payload;
          state.totalPages = 1;
        } else {
          const limit = 10;
          const products = payload.products || payload.data || [];
          const totalCount =
            payload.totalCount || payload.total_count || products.length;

          state.items = products;
          state.totalPages = Math.ceil(totalCount / limit);
        }
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.items = [];
      })

      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.currentProduct = null;
      })

      // ====== Create ======
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload); // Add to beginning
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ====== Update ======
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx >= 0) {
          state.items[idx] = action.payload;
        }
        // Update currentProduct if it's the same one
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ====== Delete ======
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((p) => p.id !== action.payload);
        // Clear currentProduct if it was deleted
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct, setPage, clearError } =
  productsSlice.actions;
export default productsSlice.reducer;
