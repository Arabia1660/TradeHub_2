import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAuth } from "../providers/AuthProvider";
import { postApi } from "../API";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const {login}=useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      return alert("Please fill in all fields");
    } 
    try {
      const res = await postApi("/users/login", {
        email: form.username,
        password: form.password,
      });
      login(res.data)
      alert("Successful");
      window.location.href = "/";
    } catch (error) {
      alert(error.response.data);
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <TextField
          fullWidth
          label="Email"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
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
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
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
        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: "#07C236",
            "&:hover": {
              backgroundColor: "#06A32F",
            },
          }}
        >
          Login
        </Button>
      </form>
      <Typography variant="body2" className="mt-4">
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#07C236" }}>
          Register here
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
