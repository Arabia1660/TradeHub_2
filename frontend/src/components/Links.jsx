import React from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon, Box } from "@mui/material";
import {
  FaTachometerAlt, // Dashboard Icon
  FaUser,
  FaChartLine,
  FaMoneyCheck,
  FaExchangeAlt,
  FaWallet,
  FaArrowCircleDown,
  FaUsers,
} from "react-icons/fa";
import { SiCoinmarketcap } from "react-icons/si";
import { useAuth } from "../providers/AuthProvider";
import "./Links.css"; // Import the CSS file for custom styles

const Links = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Updated list of links with the added Dashboard
  const links = [
    { to: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
    { to: "/investment", label: "Investment", icon: <FaChartLine /> },
    { to: "/transactions", label: "Transactions", icon: <FaMoneyCheck /> },
    { to: "/trade", label: "Trade", icon: <FaExchangeAlt /> },
    { to: "/market", label: "Forex", icon: <SiCoinmarketcap /> },
    { to: "/deposit", label: "Deposit", icon: <FaWallet /> },
    { to: "/withdraw", label: "Withdraw", icon: <FaArrowCircleDown /> },
    { to: "/social", label: "Social", icon: <FaUsers /> },
  ];

  return (
    <Box>
      <div className="my-4 text-xl text-center">Client Side</div>
      <List
        className="custom-scrollbar" // Apply the custom scrollbar class here
        sx={{ width: "100%" }}
      >
        {links.map((link) => {
          const isActive =
            link.to === "/"
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);

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

export default Links;
