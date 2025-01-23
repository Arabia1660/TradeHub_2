import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { AiOutlineLogout, AiOutlineSearch } from "react-icons/ai";
import { useAuth } from "../providers/AuthProvider";
import { postApi } from "../API";
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout,login } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  useEffect(() => {
    postApi("/users/login", {
      email: user.email,
      password: user.password,
    }).then((res) => {
      login(res.data);
    });
  }, [currentPath]);

  const handleLogout = async () => {
    logout();
    alert("Success");
    window.location.href = "/";
  };
  const handleSearch = () => {
    // Navigate to the search results page with the search query as a URL parameter
    navigate(`/search?search=${searchQuery}`);
  };

  return (
    <Box className="flex items-center justify-between p-4 bg-[#D9D9D9] ">
      {/* Search Bar */}
      {user?.isAdmin ? (
        <Box />
      ) : (
        <TextField
          fullWidth
          placeholder="Enter stock symbol (e.g., AAPL)"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            maxWidth: "50%",
            backgroundColor: "white",
            borderRadius: "25px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderRadius: "25px",
              },
              "&:hover fieldset": {
                borderColor: "#07C236",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#07C236",
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <AiOutlineSearch />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
      <Box />

      {/* User Info and Logout */}
      <Box className="flex items-center space-x-4">
        {user?.isAdmin ? (
          <Box />
        ) : (
          <Box className="text-right">
            <Typography variant="body1" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.balance?.toFixed(2) || "0.00"} USD
            </Typography>
          </Box>
        )}

        {user?.isAdmin ? (
          <IconButton onClick={handleLogout}>
            <AiOutlineLogout className="mr-2" />
            Logout
          </IconButton>
        ) : (
          <IconButton onClick={handleLogout}>
            <AiOutlineLogout />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Header;
