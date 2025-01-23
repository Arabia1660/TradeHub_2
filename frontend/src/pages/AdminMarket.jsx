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
} from "@mui/material";
import SearchableSelect from "../components/SearchableSelect";
import { deleteApi, getApi, postApi } from "../API";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const DummySymbolData = [
  { id: 1, symbol: "100" },
  { id: 2, symbol: "200" },
  { id: 3, symbol: "300" },
];

const AdminMarket = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [tableData, setTableData] = useState([]);
  const [text, setText] = useState();
  const [data, setData] = useState([]);

  const handleAdd = () => {
    if (selectedSymbol) {
      const newEntry = {
        no: Math.random().toString().substring(2, 10), // Random No
        symbol: selectedSymbol,
        date: new Date().toLocaleString(),
      };
      setTableData([...tableData, newEntry]);
      setSelectedSymbol("");
    } else {
      alert("Please select a symbol!");
    }
  };
  useEffect(() => {
    getAllSymbols();
  }, []);
  useEffect(() => {
    text && searchSymbol();
  }, [text]);
  const searchSymbol = async () => {
    try {
      // Fetch live exchange rates from API
      const res = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
      const rates = res.data.rates;
  
      // Filter and format data based on the search input
      const filteredData = Object.entries(rates)
        .filter(([symbol]) => symbol.toLowerCase().includes(text.toLowerCase())) // Filter by search term
        .map(([symbol, rate], index) => ({
          id: index + 1,
          symbol: symbol,
        }));
  
      // Update state with filtered data
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching exchange rates:", error.message);
      alert("Failed to fetch data. Please try again.");
    }
  };
  const getAllSymbols = async () => {
    try {
      const res = await getApi("/trade/get-currency-symbol");
      setTableData(res.data);
    } catch (error) {
      alert(error.message);
    }
  };
  const addSymbol = async () => {
    try {
      await postApi("/trade/add-currency-symbol", {
        stock_symbol: selectedSymbol,
      });
      getAllSymbols();
    } catch (error) {
      alert(error.message);
    }
  };
  const deleteSymbol = async (id) => {
    //console.log(id)
    try {
      await deleteApi("/trade/delete-currency-symbol", {
        id: id,
      });
      getAllSymbols();
    } catch (error) {
      console.log(error)
      alert(error.message);
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
                <strong>No</strong>
              </TableCell>
              <TableCell>
                <strong>Symbol</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.stock_symbol}</TableCell>
                <TableCell>{new Date(row.created_at).toDateString()}</TableCell>
                <TableCell><MdDelete size={30} color="red" onClick={()=>deleteSymbol(row.id)} /></TableCell>
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
        <SearchableSelect
          text={text}
          onChange={(e) => setText(e.target.value)}
          selectedSymbol={selectedSymbol}
          DummySymbolData={data}
          placeholder={"Search stock..eg. Apple"}
          setSelectedSymbol={setSelectedSymbol}
        />

        <Button
          variant="contained"
          sx={{ backgroundColor: "#07C236", color: "white" }}
          onClick={addSymbol}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AdminMarket;
