"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { deleteProduct, fetchProducts } from "@/redux/slices/productSlice";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const { items, status, error, totalPages } = useSelector(
    (state) => state.products
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (token) dispatch(fetchProducts({ page, search }));
  }, [dispatch, page, search, token]);

  // Delete confirmation
  const handleDelete = (id) => setConfirmDeleteId(id);
  const confirmDelete = () => {
    dispatch(deleteProduct(confirmDeleteId));
    setConfirmDeleteId(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <Typography variant="h5" color="primary">
            Products
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#072e81",
              color: "white",
              textTransform: "none",
              ":hover": { bgcolor: "#0a66c2" },
            }}
            onClick={() => router.push("/products/create-product")}
          >
            + Create Product
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <TextField
            label="Search products..."
            variant="outlined"
            fullWidth
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Loading & Error states */}
        {status === "loading" && (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        )}

        {status === "failed" && (
          <Typography color="error" align="center">
            {error || "Failed to load products"}
          </Typography>
        )}

        {/* Product List */}
        {status === "succeeded" && (
          <>
            {items.length === 0 ? (
              <Typography align="center" color="text.secondary">
                No products found.
              </Typography>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {items.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} onDelete={handleDelete} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, val) => setPage(val)}
                color="primary"
              />
            </div>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this product?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
