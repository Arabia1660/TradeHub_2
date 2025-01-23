import React, { useEffect, useState } from "react";
import LiveChart from "../components/LiveChart";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { getApi, postApi } from "../API";
import { useAuth } from "../providers/AuthProvider";

const Trade = () => {
  const [symble, setSymble] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stockSymbols, setStockSymbols] = useState(["IBM"]);
  const {user,login}=useAuth()

  const updateUser=async()=>{
    try {
     const res=await postApi("/users/login", {
        email: user.email,
        password: user.password,
      })
      login(res.data);
    } catch (error) {
      alert(error.response.data)
    }
  }

  useEffect(() => {
    getApi("/trade/get-symbol").then((res) => {
      const data = res.data?.map((d) => d.stock_symbol);
      setStockSymbols(data);
    });
  }, []);
  const buyStock = async () => {
    if (!symble || !quantity) {
      return alert("Field are missing");
    }
    try {
      await postApi("/trade/buy", {
        symbol: symble,
        quantity: quantity,
      });
      updateUser()
      alert("Successful");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  const sellStock = async () => {
    if (!symble || !quantity) {
      return alert("Field are missing");
    }
    try {
      await postApi("/trade/sell", {
        symbol: symble,
        quantity: quantity,
      });
      updateUser()
      alert("Successful");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div className="grid gap-2 md:grid-cols-3">
      <div className="col-span-2">
        <LiveChart />
      </div>
      <div className="flex justify-center my-8">
        <Box
          sx={{
            width: "400px",
            backgroundColor: "#f9f9f9",
            padding: 3,
            borderRadius: "8px",
            boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          }}
        >
          <TextField
            select
            label="Select Symble"
            value={symble}
            onChange={(e) => setSymble(e.target.value)}
            fullWidth
          >
            {stockSymbols.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity"
            placeholder="How many share"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            sx={{
              marginTop: "10px",
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              margin: "10px",
            }}
          >
            <Button onClick={buyStock}
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#07C236", color: "white" }}
            >
              Buy
            </Button>
            <Button onClick={sellStock}
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#B02727", color: "white" }}
            >
              Sell
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Trade;
