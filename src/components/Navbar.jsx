"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/auth/authSlice";
import { Button } from "@mui/material";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { email, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <nav className="bg-green-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold text-[#072e81]">
          Product Management App
        </Link>

        {/* Navigation links */}
        {/* {token && ( */}
        <div className="flex items-center space-x-6">
          <Link href="/products">
            <Button
              sx={{
                textTransform: "none",
                color: "#474C49",
                width: "80px",
                fontWeight: "600",
                ":hover": { bgcolor: "#d1e7dd", color: "#0f5132" },
              }}
            >
              Products
            </Button>
          </Link>
          <Link href="/products/create">
            <Button
              sx={{
                textTransform: "none",
                color: "#474C49",
                width: "80px",
                fontWeight: "600",
                ":hover": { bgcolor: "#d1e7dd", color: "#0f5132" },
              }}
            >
              Create
            </Button>
          </Link>
        </div>
        {/* )} */}

        {/* Right side: user + logout */}
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <span className="text-gray-600 text-sm">{email}</span>
              <Button
                sx={{
                  textTransform: "none",
                  width: "80px",
                  bgcolor: "#072e81",
                  color: "white",
                  fontWeight: "600",
                  ":hover": { bgcolor: "#0a66c2" },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              //   className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              <Button
                sx={{
                  textTransform: "none",
                  width: "80px",
                  bgcolor: "#072e81",
                  color: "white",
                  fontWeight: "600",
                  ":hover": { bgcolor: "#0a66c2" },
                }}
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
