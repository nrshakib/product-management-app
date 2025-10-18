"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  CardActions,
} from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ProductCard({ product, onDelete }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        className="flex flex-col justify-between rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Optional: Product Image */}
        <CardMedia
          component="img"
          height="40"
          image={product.images[0] || "No Images Available"}
          alt={product.name}
          className="size-40 rounded-t-xl object-cover"
        />

        <CardContent className="flex flex-col gap-2">
          <Typography
            variant="h6"
            component="h2"
            color="primary"
            className="truncate"
          >
            {product.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Category:{" "}
            <span className="font-medium">{product.category.name}</span>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Price:{" "}
            <span className="font-semibold text-green-600">
              ${product.price}
            </span>
          </Typography>
        </CardContent>

        <CardActions className="flex justify-between p-3 pt-0 mt-auto">
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            size="small"
            sx={{
              textTransform: "none",
              borderColor: "#072e81",
              color: "#072e81",
              ":hover": { backgroundColor: "#e3f2fd", borderColor: "#0a66c2" },
            }}
            onClick={() => (window.location.href = `/products/${product.slug}`)}
          >
            View
          </Button>

          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            color="error"
            size="small"
            sx={{
              textTransform: "none",
            }}
            onClick={() => onDelete(product.id)}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
}
