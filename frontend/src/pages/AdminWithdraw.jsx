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
} from "@mui/material";
import { getApi, putApi } from "../API";

// Sample data for AdminWithdraw

const AdminWithdraw = () => {
  const [withdrawData, setWithdrawData] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await getApi("/bank/withdraw");
      setWithdrawData(res.data);
    } catch (error) {
      alert(error.response.data);
    }
  };
  const accept = async (id) => {
    try {
      await putApi("/bank/status-withdraw", {
        id: id,
        accept: true,
      });
      alert("Success");
      window.location.reload();
    } catch (error) {
      alert(error.response.data);
    }
  };
  const reject = async (id) => {
    try {
      await putApi("/bank/status-withdraw", {
        id: id,
        accept: true,
      });
      alert("Success");
      window.location.reload();
    } catch (error) {
      alert(error.response.data);
    }
  };
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
          Withdraw Records
        </Typography>

        {/* Deposit Table */}
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
              {withdrawData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.account_no}</TableCell>
                  <TableCell>{data.amount}</TableCell>

                  <TableCell>{data.method}</TableCell>
                  <TableCell>{data.status}</TableCell>
                  <TableCell>
                    {new Date(data.created_at).toDateString()}
                  </TableCell>
                  {data.status === "PENDING" ? (
                    <TableCell>
                      <Box display="flex" gap="8px">
                        <Button
                          onClick={() => accept(data.id)}
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
                          Accept
                        </Button>
                        <Button
                          onClick={() => reject(data.id)}
                          fullWidth
                          variant="contained"
                          type="submit"
                          sx={{
                            backgroundColor: "#E21E1E",
                            "&:hover": {
                              backgroundColor: "#B02727",
                            },
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AdminWithdraw;
