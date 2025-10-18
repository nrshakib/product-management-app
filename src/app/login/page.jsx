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
import { motion } from "framer-motion";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const { token, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) router.push("/products");
  }, [token, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation
    if (!email) {
      setLocalError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Invalid email format");
      return;
    }

    await dispatch(login(email));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4 shadow-xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card sx={{ maxWidth: 600, width: "100%", p: 2, borderRadius: 3 }}>
          <CardContent>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Login
            </h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                disabled={status === "loading"}
              />
              {(localError || error) && (
                <p className="text-red-500 text-sm">
                  {localError || error?.message || "Login failed"}
                </p>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={status === "loading"}
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#072e81",
                  ":hover": { bgcolor: "#0a66c2" },
                }}
              >
                {status === "loading" ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
