import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import { postApi } from "../API";
import { useAuth } from "../providers/AuthProvider";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const {login}=useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleOTP = () => {
  //   if (form.email) {
  //     setOtpSent(true);
  //     alert("OTP sent to your email!");
  //   } else {
  //     alert("Please provide a valid email");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      form.password !== form.confirmPassword ||
      !form.firstName ||
      !form.lastName ||
      !form.city
    ) {
      return alert("Please fill in all fields and match passwords");
    }
    try {
      const res = await postApi("/users/create", {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
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
    <Box
      className="flex flex-col items-center justify-center h-screen bg-gray-100"
      sx={{ padding: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#07C236" },
              "&:hover fieldset": { borderColor: "#07C236" },
              "&.Mui-focused fieldset": { borderColor: "#07C236" },
            },
          }}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#07C236" },
              "&:hover fieldset": { borderColor: "#07C236" },
              "&.Mui-focused fieldset": { borderColor: "#07C236" },
            },
          }}
        />
        <TextField
          fullWidth
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#07C236" },
              "&:hover fieldset": { borderColor: "#07C236" },
              "&.Mui-focused fieldset": { borderColor: "#07C236" },
            },
          }}
        />
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#07C236" },
              "&:hover fieldset": { borderColor: "#07C236" },
              "&.Mui-focused fieldset": { borderColor: "#07C236" },
            },
          }}
        />
        {/* {!otpSent ? (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleOTP}
            sx={{
              color: "#07C236",
              borderColor: "#07C236",
              "&:hover": {
                backgroundColor: "#E6F8EC",
                borderColor: "#07C236",
              },
            }}
          >
            Send OTP
          </Button>
        ) : (
          <TextField
            fullWidth
            label="OTP"
            name="otp"
            value={form.otp}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#07C236" },
                "&:hover fieldset": { borderColor: "#07C236" },
                "&.Mui-focused fieldset": { borderColor: "#07C236" },
              },
            }}
          />
        )} */}
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
              "& fieldset": { borderColor: "#07C236" },
              "&:hover fieldset": { borderColor: "#07C236" },
              "&.Mui-focused fieldset": { borderColor: "#07C236" },
            },
          }}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#07C236" },
              "&:hover fieldset": { borderColor: "#07C236" },
              "&.Mui-focused fieldset": { borderColor: "#07C236" },
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
          Register
        </Button>
      </form>
      <Typography variant="body2" className="mt-4">
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#07C236" }}>
          Login here
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUp;
