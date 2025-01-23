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
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import { getApi, postApi } from "../API";

// Sample data for Deposit
const depositData = [
  {
    tranxID: "34124fdfsdfsd",
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
const Deposit = () => {
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [traxId, setTraxId] = useState("");
  const [amount, setAmount] = useState("");
  const [methods, setMethods] = useState([]);
  const [data, setData] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getApi("/bank/get-bank").then((res) => {
      setMethods(res.data);
    });
  }, []);
  useEffect(() => {
    getApi("/bank/deposit").then((res) => {
      setData(res.data);
    });
  }, []);

  const handleSubmit = async () => {
    try {
      await postApi("/bank/deposit", {
        tnx_id: traxId,
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
        Create Deposit
      </Button>
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

          {/* Select Field */}
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
          <Typography>
            Send money to the number{" "}
            <strong>
              {methods.find((d) => d.id === selectedMethod)?.account || ""}
            </strong>{" "}
            and give the transaction ID below.
          </Typography>

          {/* Trax ID Field */}
          <TextField
            label="Trax ID"
            placeholder="Enter transaction ID"
            value={traxId}
            onChange={(e) => setTraxId(e.target.value)}
            fullWidth
          />

          {/* Amount Field */}
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
            Deposit Records
          </Typography>

          {/* Deposit Table */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="investment table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                  >
                    Tranx ID
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
                    <TableCell>{data.tnx_id}</TableCell>
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

export default Deposit;
