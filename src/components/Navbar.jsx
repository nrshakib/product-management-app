"use client";

import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

export default function Navbar() {
//   const { token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const router = useRouter();

  const handleLogout = () => {
    // dispatch(logout());
    router.push("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h6">Product App</Typography>
        {/* {token && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )} */}
      </Toolbar>
    </AppBar>
  );
}
