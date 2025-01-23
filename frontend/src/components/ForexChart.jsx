import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getApi } from "../API";
import axios from "axios";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Connect to the backend
const socket = io("http://localhost:5000"); // Update URL if hosted

const ForexChart = () => {
  const [chartData, setChartData] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  

  const [stockSymbols,setStockSymbols]=useState(["BDT"])

 useEffect(()=>{
    getApi("/trade/get-symbol",{
        currency:"dfe"
    }).then(res=>{
      const data=res.data?.map(d=>d.stock_symbol)
      setStockSymbols(data)
    })
  },[])

  useEffect(() => {
    // Listen for initial price history from the server
    // socket.on("initialPriceHistory", (data) => {
    //   setPriceHistory(data);
    // });

    // Listen for live stock price updates from the server
    socket.on("currencyPriceUpdate", (data) => {
      console.log("Received stock price update:", data);
      setPriceHistory((prevHistory) => {
        const updatedHistory = { ...prevHistory };
        if (!updatedHistory[data.symbol]) updatedHistory[data.symbol] = [];
        updatedHistory[data.symbol].push(data);
        if (updatedHistory[data.symbol].length > 50)
          updatedHistory[data.symbol].shift(); // Limit to 50 points
        return updatedHistory;
      });
    });

    // Clean up on component unmount
    return () => {
      //socket.off("initialPriceHistory");
      socket.off("currencyPriceUpdate");
    };
  }, []);

  // Prepare the data for Chart.js
  const prepareChartData = () => {
    return {
      labels:
        priceHistory[stockSymbols[0]]?.map((entry) =>
          new Date(entry.time).toLocaleTimeString()
        ) || [],
      datasets: stockSymbols.map((symbol, index) => ({
        label: `USD/${symbol} Price`,
        data: priceHistory[symbol]?.map((entry) => entry.price) || [],
        borderColor: getRandomColor(),
        borderWidth: 2,
        fill: false,
      })),
    };
  };

  // Generate random color for each stock line
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD->Other)",
        },
      },
    },
  };

  return (
    <div>
      <h1>Live Market Prices</h1>
      <div style={{ height: "500px" }}>
        {Object.keys(priceHistory).length > 0 ? (
          <Line data={prepareChartData()} options={options} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default ForexChart;
