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
} from "@mui/material";
import { getApi } from "../API";

// Sample data for Transactions

const Transactions = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getApi("/trade/transaction").then((res) => {
      setData(res.data);
    });
  }, []);
  return (
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
          Transactions Records
        </Typography>

        {/* Transactions Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Transactions table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                >
                  Symbol
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                >
                  Buy Time
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                >
                  Buy/Sell Price
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
                >
                  Type
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((transactions, index) => (
                <TableRow key={index}>
                  <TableCell>{transactions.stock_symbol}</TableCell>
                  <TableCell>{transactions.quantity}</TableCell>
                  <TableCell>
                    {new Date(transactions.created_at).toDateString()}
                    <br />
                    {new Date(transactions.created_at).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>{transactions.price}</TableCell>
                  <TableCell>{transactions.transaction_type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Transactions;
