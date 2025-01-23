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

// Sample data for investments


const Investment = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getApi("/trade/investment").then((res) => {
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
          Investment Records
        </Typography>

        {/* Investment Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="investment table">
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
                  Buy Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((investment, index) => (
                <TableRow key={index}>
                  <TableCell>{investment.stock_symbol}</TableCell>
                  <TableCell>{investment.quantity}</TableCell>
                  <TableCell>
                    {new Date(investment.created_at).toDateString()}
                    <br/>
                    {new Date(investment.created_at).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>{investment.buy_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Investment;
