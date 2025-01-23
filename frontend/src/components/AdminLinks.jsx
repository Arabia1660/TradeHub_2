import React from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon, Box } from "@mui/material";
import {
  FaTachometerAlt, // Dashboard Icon
  FaWallet,
  FaArrowCircleDown,
  FaRegShareSquare,
  FaHome,
} from "react-icons/fa";
import { useAuth } from "../providers/AuthProvider";
import { SiCoinmarketcap } from "react-icons/si";

const AdminLinks = () => {
  const { user } = useAuth();

  const location = useLocation();

  // Updated list of links with the added Dashboard
  const links = [
    { to: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/admin-shares", label: "Shares", icon: <FaRegShareSquare /> },
    { to: "/admin-deposit", label: "Deposit", icon: <FaWallet /> },
    { to: "/admin-withdraw", label: "Withdraw", icon: <FaArrowCircleDown /> },
    { to: "/admin-banks", label: "Banks", icon: <FaHome /> },
    { to: "/admin-market", label: "Market", icon: <SiCoinmarketcap /> },
  ];

  return (
    <Box>
      <div className="my-4 text-xl text-center">Admin</div>
      <List sx={{ width: "100%" }}>
        {links.map((link) => {
          // Handle active state logic
          const isActive =
            link.to === "/"
              ? location.pathname === link.to // Dashboard only active for exact "/"
              : location.pathname.startsWith(link.to); // Other links can be active on nested paths

          return (
            <ListItem
              key={link.to}
              button
              component={Link}
              to={link.to}
              sx={{
                borderRadius: "8px",
                marginY: 1,
                bgcolor: isActive ? "#07C236" : "transparent",
                color: isActive ? "white" : "inherit",
                "&:hover": {
                  bgcolor: "#07C236",
                  color: "white",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "white" : "inherit",
                }}
              >
                {link.icon}
              </ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default AdminLinks;
