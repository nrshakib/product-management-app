"use client";

import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function ProductCard({ product, onDelete }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="shadow-md hover:shadow-lg transition">
        <CardContent className="flex flex-col justify-between h-full">
          <div>
            <Typography variant="h6" color="primary" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Category: {product.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price: ${product.price}
            </Typography>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              size="small"
              onClick={() => (window.location.href = `/products/${product.id}`)}
              sx={{
                textTransform: "none",
                color: "#072e81",
                ":hover": { bgcolor: "#d1e7dd" },
              }}
            >
              View
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(product.id)}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
