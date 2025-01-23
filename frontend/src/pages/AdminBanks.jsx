import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import { AiTwotoneDelete } from "react-icons/ai";
import { deleteApi, getApi, postApi } from "../API";
const DummyMethodData = [
  { id: 1, name: "Bkash" },
  { id: 2, name: "Rocket" },
  { id: 3, name: "Nagad" },
];

const AdminBanks = () => {
  const [method, setMethod] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [depositData, setDepositData] = useState([]);

  useEffect(() => {
    getBanks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteApi("/bank/delete-bank", {
        id: id,
      });
      getBanks();
    } catch (error) {
      alert(error.response.data);
    }
  };
  const getBanks = async () => {
    try {
      const res = await getApi("/bank/get-bank");
      setDepositData(res.data);
    } catch (error) {
      alert(error.response.data);
    }
  };
  const addBank = async () => {
    try {
      await postApi("/bank/add-bank", {
        method: method,
        account: accountNo,
      });
      getBanks()
    } catch (error) {
      alert(error.response.data);
    }
  };

  return (
    <Box sx={{ padding: 4, display: "flex", gap: 4 }}>
      {/* Table Section */}
      <TableContainer component={Paper} sx={{ flex: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Account No</strong>
              </TableCell>
              <TableCell>
                <strong>Method</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {depositData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.account}</TableCell>
                <TableCell>
                  <Typography>{row.method}</Typography>
                </TableCell>
                <TableCell>{new Date(row.created_at).toDateString()}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <AiTwotoneDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Input Form Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#f9f9f9",
          padding: 3,
          borderRadius: "8px",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          select
          label="Method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          fullWidth
        >
          {DummyMethodData.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Account No"
          placeholder="Enter account no"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          sx={{ backgroundColor: "#07C236", color: "white" }}
          onClick={addBank}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AdminBanks;
