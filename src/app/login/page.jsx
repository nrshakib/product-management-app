"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "@/redux/slices/authSlice";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const { token, status, error } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.push("/products");
    }
  }, [token, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation
    if (!email.trim()) {
      setLocalError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Invalid email format");
      return;
    }

    try {
      const result = await dispatch(login(email)).unwrap();
      console.log("Login successful:", result);
      if (result.email && result.token) {
        toast.success("Login successful!");
        return { token: response.data.token, email };
      }
    } catch (err) {
      console.error("Login failed:", err);
      // Error will be shown from Redux state
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Sign in to access your products
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <TextField
                label="Email Address"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                disabled={status === "loading"}
                autoComplete="email"
                autoFocus
              />

              {(localError || error) && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {localError ||
                    (typeof error === "string"
                      ? error
                      : error?.message || "Login failed. Please try again.")}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={status === "loading"}
                fullWidth
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  bgcolor: "#072e81",
                  borderRadius: 2,
                  ":hover": { bgcolor: "#0a66c2" },
                  ":disabled": { bgcolor: "#e0e0e0" },
                }}
              >
                {status === "loading" ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress size={20} color="inherit" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
