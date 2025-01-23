import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { putApi } from "../API";
import { useAuth } from "../providers/AuthProvider";

const Profile = () => {
  // State to hold form data
  const {user,login}=useAuth()
  const [form, setForm] = useState({
    name: user?.name,
    companyName: user?.company,
    email: user?.email,
    address: user?.address,
    password: user?.password,
  });

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      form.name &&
      form.companyName &&
      form.email &&
      form.address &&
      form.password
    ) {
      // Simulate a backend update
      putApi("/users/update", {
        name: form.name,
        company: form.companyName,
        email: form.email,
        address: form.address,
        password: form.password,
      })
        .then((res) => {
          alert("Profile updated successfully!");
          login(res.data)
          
        })
        .catch((err) => {
          alert(err.response.data);
        });
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 400, // Restrict max width for better responsiveness
          display: "flex",
          flexDirection: "column",
          gap: 2, // Spacing between input fields
          padding: "24px",
          bgcolor: "white",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Name Field */}
        <Typography>Name</Typography>
        <TextField
          variant="outlined"
          placeholder="Your Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#07C236",
              },
              "&:hover fieldset": {
                borderColor: "#07C236",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#07C236",
              },
            },
          }}
        />

        {/* Company Name Field */}
        <Typography>Company Name</Typography>
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#07C236",
              },
              "&:hover fieldset": {
                borderColor: "#07C236",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#07C236",
              },
            },
          }}
          variant="outlined"
          placeholder="Your company name"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          fullWidth
          size="small"
        />

        {/* Email Field */}
        <Typography>Email</Typography>
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#07C236",
              },
              "&:hover fieldset": {
                borderColor: "#07C236",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#07C236",
              },
            },
          }}
          variant="outlined"
          placeholder="Your Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          size="small"
        />

        {/* Address Field */}
        <Typography>Address</Typography>
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#07C236",
              },
              "&:hover fieldset": {
                borderColor: "#07C236",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#07C236",
              },
            },
          }}
          variant="outlined"
          placeholder="Your Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          size="small"
        />

        {/* Password Field */}
        <Typography>Password</Typography>
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#07C236",
              },
              "&:hover fieldset": {
                borderColor: "#07C236",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#07C236",
              },
            },
          }}
          variant="outlined"
          placeholder="Your Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          size="small"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#07C236",
            color: "white",
            textTransform: "none",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#05A628",
            },
          }}
          fullWidth
        >
          Update Now
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
