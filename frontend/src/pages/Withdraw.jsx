import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Modal,
} from "@mui/material";
import { getApi, postApi } from "../API";

// Sample data for Withdraw
const withdrawData = [
  {
    accountNo: "34124fdfsdfsd",
    amount: 200,
    method: "Bkash",
    status: "PENDING",
    date: "11 Jan 2024 at 23:00",
  },
];
const DummyMethods = [
  { id: 1, method: "Bkash" },
  { id: 2, method: "Nagad" },
  { id: 3, method: "Rocket" },
];
const Withdraw = () => {
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [methods, setMethods] = useState([]);
  const [data, setData] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSelectedMethod("");
    setNumber("");
    setAmount("");
    setOpen(false);
  };
  useEffect(() => {
    getApi("/bank/get-bank").then((res) => {
      setMethods(res.data);
    });
  }, []);
  useEffect(() => {
    getApi("/bank/withdraw").then((res) => {
      setData(res.data);
    });
  }, []);

  const handleSubmit = async () => {
    try {
      await postApi("/bank/withdraw", {
        account_no: number,
        amount: amount,
        bankId: selectedMethod,
      });
      alert("Submitted!");
      window.location.reload();
    } catch (error) {
      alert(error.response.data);
    }
  };
  return (
    <Box>
      <Button
        onClick={handleOpen}
        variant="contained"
        type="submit"
        sx={{
          margin: "10px",
          backgroundColor: "#07C236",
          "&:hover": {
            backgroundColor: "#06A32F",
          },
        }}
      >
        Create Withdraw
      </Button>
      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Select Method
          </Typography>

          {/* Dropdown for Method */}
          <TextField
            select
            label="Select Method"
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            fullWidth
          >
            {methods.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.method}
              </MenuItem>
            ))}
          </TextField>

          {/* Instruction */}
          <Typography>Give your number below</Typography>

          {/* Input for Number */}
          <TextField
            label="Number"
            placeholder="Enter your number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
          />

          {/* Input for Amount */}
          <TextField
            label="Amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />

          {/* Action Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "#07C236", color: "white" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#FF0000", color: "white" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "900px" }}>
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              marginBottom: 2,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Withdraw Records
          </Typography>

          {/* Withdraw Table */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="investment table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                  >
                    Account No
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                  >
                    Method
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                  >
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.account}</TableCell>
                    <TableCell>{data.amount}</TableCell>

                    <TableCell>{data.method}</TableCell>
                    <TableCell>{data.status}</TableCell>
                    <TableCell>
                     {new Date(data.created_at).toDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Withdraw;
