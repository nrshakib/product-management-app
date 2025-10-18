"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import {
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { email, token } = useSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = (open) => () => setMobileOpen(open);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <nav className="bg-green-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="sm:text-2xl font-semibold text-[#072e81]">
          Product Management App
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
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
          {/* <Link href="/products/create">
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
          </Link> */}
        </div>

        {/* Right side (desktop): user + logout */}
        <div className="hidden md:flex items-center space-x-4">
          {token ? (
            <>
              <p className="text-gray-600 text-sm">{email}</p>
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
            <Link href="/login">
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

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ color: "#072e81" }} />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-64 bg-green-50 h-full flex flex-col"
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#072e81]">Menu</h2>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon sx={{ color: "#072e81" }} />
            </IconButton>
          </div>

          <List className="flex-1">
            <ListItem
              button
              component={Link}
              href="/products"
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="Products" />
            </ListItem>
            {/* <ListItem
              button
              component={Link}
              href="/products/create"
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="Create Product" />
            </ListItem> */}
            <Divider />
            {token ? (
              <>
                <ListItem>
                  <ListItemText primary={email} secondary="Logged in" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <ListItem
                button
                component={Link}
                href="/login"
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary="Login" />
              </ListItem>
            )}
          </List>
        </motion.div>
      </Drawer>
    </nav>
  );
}
