"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
} from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import {
  fetchProductById,
  deleteProduct,
  clearCurrentProduct,
} from "@/redux/slices/productSlice";

export default function ProductDetailsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const { token } = useSelector((state) => state.auth);
  const { currentProduct, status, error } = useSelector(
    (state) => state.products
  );

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/login");
    }
  }, [mounted, token, router]);

  useEffect(() => {
    if (mounted && token && productId) {
      dispatch(fetchProductById(productId));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId, token, mounted]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      router.push("/products");
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (!mounted || !token) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (status === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex justify-center items-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <CircularProgress size={48} />
        </motion.div>
      </motion.div>
    );
  }

  if (status === "failed" || !currentProduct) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button onClick={() => router.push("/products")} sx={{ mb: 2 }}>
              ← Back to Products
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="error">
                {error || "Product not found"}
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/products")}
                sx={{ mt: 2 }}
              >
                Go Back
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const images = currentProduct.images || [];
  const category = currentProduct.category || {};

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Button
            onClick={() => router.push("/products")}
            sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}
          >
            ← Back to Products
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
              <CardContent sx={{ p: 0 }}>
                {/* Main Image with AnimatePresence */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 400,
                    bgcolor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {images.length > 0 ? (
                      <motion.img
                        key={selectedImage}
                        src={images[selectedImage]}
                        alt={currentProduct.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Typography variant="h6" color="text.secondary">
                          No Image Available
                        </Typography>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <Box
                    sx={{ p: 2, display: "flex", gap: 1, overflowX: "auto" }}
                  >
                    {images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Box
                          onClick={() => setSelectedImage(idx)}
                          sx={{
                            position: "relative",
                            width: 80,
                            height: 80,
                            border:
                              selectedImage === idx
                                ? "3px solid #072e81"
                                : "1px solid #ddd",
                            borderRadius: 2,
                            cursor: "pointer",
                            flexShrink: 0,
                            overflow: "hidden",
                            bgcolor: "#f5f5f5",
                            transition: "all 0.2s",
                          }}
                        >
                          <img
                            src={img}
                            alt={`${currentProduct.name} ${idx + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col gap-4">
            {/* Main Product Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Category Badge */}
                  {category.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={category.name}
                          sx={{
                            bgcolor: "#072e81",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                          }}
                        />
                      </Box>
                    </motion.div>
                  )}

                  {/* Product Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ wordBreak: "break-word" }}
                    >
                      {currentProduct.name}
                    </Typography>
                  </motion.div>

                  {/* Price */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color="primary"
                      gutterBottom
                    >
                      ${parseFloat(currentProduct.price).toFixed(2)}
                    </Typography>
                  </motion.div>

                  <Divider sx={{ my: 3 }} />

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-4"
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                    >
                      Description
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.7,
                      }}
                    >
                      {currentProduct.description}
                    </Typography>
                  </motion.div>

                  <Divider sx={{ my: 3 }} />

                  {/* Product Details */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    {[
                      { label: "Product ID", value: currentProduct.id },
                      { label: "Slug", value: currentProduct.slug },
                      { label: "Category", value: category.name },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.65 + idx * 0.05 }}
                        className="flex justify-between items-center"
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{
                            fontSize:
                              item.label === "Product ID"
                                ? "0.75rem"
                                : "inherit",
                          }}
                        >
                          {item.value}
                        </Typography>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <div className="flex gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ flex: 1 }}
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() =>
                          router.push(`/products/${productId}/edit`)
                        }
                        sx={{
                          bgcolor: "#072e81",
                          textTransform: "none",
                          fontWeight: 600,
                          py: 1.5,
                          ":hover": { bgcolor: "#0a66c2" },
                        }}
                      >
                        Edit Product
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ flex: 1 }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => setConfirmDelete(true)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          py: 1.5,
                          borderWidth: 2,
                          ":hover": { borderWidth: 2 },
                        }}
                      >
                        Delete Product
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Timestamps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Product Information
                  </Typography>
                  <div className="space-y-2 mt-3">
                    {[
                      {
                        label: "Created At",
                        value: currentProduct.createdAt,
                      },
                      {
                        label: "Last Updated",
                        value: currentProduct.updatedAt,
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.05 }}
                        className="flex justify-between items-center"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {new Date(item.value).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Details */}
            {category.image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                whileHover={{ y: -5 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Category Details
                    </Typography>
                    <div className="flex items-center gap-3 mt-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: "#f5f5f5",
                          }}
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      </motion.div>
                      <div>
                        <Typography variant="body1" fontWeight="bold">
                          {category.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Category ID: {category.id}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {confirmDelete && (
            <Dialog
              open={confirmDelete}
              onClose={() => setConfirmDelete(false)}
              maxWidth="xs"
              fullWidth
              PaperComponent={motion.div}
              PaperProps={{
                initial: { opacity: 0, scale: 0.9, y: 20 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.9, y: 20 },
                transition: { duration: 0.2 },
              }}
            >
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete "{currentProduct.name}"? This
                  action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setConfirmDelete(false)}
                    sx={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleDelete}
                    color="error"
                    variant="contained"
                    sx={{ textTransform: "none" }}
                  >
                    Delete
                  </Button>
                </motion.div>
              </DialogActions>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
