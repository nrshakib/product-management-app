"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { createProduct } from "@/redux/slices/productSlice";

export default function CreateProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = "Stock must be 0 or greater";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        stock: parseInt(formData.stock),
      };

      await dispatch(createProduct(productData)).unwrap();
      router.push("/products");
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-6">
            <Button
              onClick={() => router.push("/products")}
              sx={{ mb: 2, textTransform: "none" }}
            >
              ← Back to Products
            </Button>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Create New Product
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Fill in the details below to create a new product
            </Typography>
          </div>

          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Product Name */}
                <TextField
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  disabled={status === "loading"}
                  placeholder="Enter product name"
                />

                {/* Description */}
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  disabled={status === "loading"}
                  placeholder="Enter product description"
                />

                {/* Price and Stock Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.price}
                    helperText={formErrors.price}
                    disabled={status === "loading"}
                    placeholder="0.00"
                    inputProps={{ step: "0.01", min: "0" }}
                  />

                  <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.stock}
                    helperText={formErrors.stock}
                    disabled={status === "loading"}
                    placeholder="0"
                    inputProps={{ min: "0" }}
                  />
                </div>

                {/* Category */}
                <TextField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.category}
                  helperText={formErrors.category}
                  disabled={status === "loading"}
                  placeholder="e.g., Electronics, Clothing, Food"
                />

                {/* Error Alert */}
                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {typeof error === "string"
                      ? error
                      : error?.message || "Failed to create product"}
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    onClick={() => router.push("/products")}
                    disabled={status === "loading"}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={status === "loading"}
                    sx={{
                      bgcolor: "#072e81",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                      ":hover": { bgcolor: "#0a66c2" },
                    }}
                  >
                    {status === "loading" ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
