import React, { useEffect, useState } from "react";
import { getApi } from "../API";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState({
    totalProfit: 0,
    totalInvest: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
    last15DaysProfit: [],
  });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  useEffect(() => {
    getApi("/users/dashboard").then((res) => {
      setData(res.data);
      const last15DaysProfit = res.data.last15DaysProfit;
      // Extracting labels (dates) and data (profit)
      const labels = last15DaysProfit.map((item) => new Date(item.day).toDateString());
      const data = last15DaysProfit.map((item) => parseFloat(item.profit));

      // Setting the chart data
      setChartData({
        labels,
        datasets: [
          {
            label: "Profit (USD)",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Custom color for bars
            borderColor: "rgba(75, 192, 192, 1)", // Border color of bars
            borderWidth: 1, // Border thickness
          },
        ],
      });
    });
  }, []);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, // Hide gridlines on x-axis
        },
        ticks: {
          maxRotation: 45, // Rotate x-axis labels
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true, // Start y-axis from 0
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Light gridline color
        },
      },
    },
    plugins: {
      legend: {
        display: true, // Show the label (Profit USD)
        position: "top",
      },
    },
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Cards Section */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {["Profit", "Invest", "Deposit", "Withdraw"].map((item) => (
          <div
            key={item}
            className="p-6 text-center bg-green-100 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-medium">{item}</h3>
            <p className="mt-2 text-3xl font-semibold">
              {item === "Profit"
                ? data?.totalProfit
                : item === "Invest"
                ? data.totalInvest
                : item === "Deposit"
                ? data.totalDeposit
                : data.totalWithdraw}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="p-6 bg-white rounded-lg shadow-md max-h-[450px]">
        <h2 className="mb-4 text-lg font-bold">Stacked Chart</h2>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
